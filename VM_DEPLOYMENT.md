# VM Deployment Guide

VM host: `badproject1.centralindia.cloudapp.azure.com`

## 1. Build and upload from the Mac

Run from the repository root:

```bash
cd ~/AU-Campus-HelpDesk
npm --prefix frontend install
npm --prefix frontend run build

tar --exclude='backend/node_modules' \
    --exclude='frontend/node_modules' \
    --exclude='backend/.env' \
    -czf ~/AU-Campus-HelpDesk-upload.tar.gz \
    backend frontend

scp -i ~/Downloads/BADProject1_key.pem \
  ~/AU-Campus-HelpDesk-upload.tar.gz \
  azureuser@badproject1.centralindia.cloudapp.azure.com:~/
```

`backend/.env` is excluded so the VM production settings are preserved.

## 2. Deploy the backend on the VM

```bash
ssh -i ~/Downloads/BADProject1_key.pem \
  azureuser@badproject1.centralindia.cloudapp.azure.com

cd ~/AU-Campus-HelpDesk
tar -xzf ~/AU-Campus-HelpDesk-upload.tar.gz --overwrite

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

The `tar` warnings about `LIBARCHIVE.xattr.com.apple.provenance` are harmless macOS metadata warnings.

## 3. Check the VM environment

The backend and frontend must use the same Microsoft application IDs.

Edit the VM environment file:

```bash
cd ~/AU-Campus-HelpDesk/backend
nano .env
```

Required values:

```dotenv
MICROSOFT_TENANT_ID="your-tenant-id"
MICROSOFT_CLIENT_ID="the-same-client-id-used-by-frontend"
MICROSOFT_ALLOWED_DOMAIN="au.edu"
```

The VM `MICROSOFT_CLIENT_ID` must match the local `frontend/.env` value:

```dotenv
VITE_MICROSOFT_CLIENT_ID="the-same-client-id-used-by-backend"
```

Restart after changing `.env`:

```bash
npx pm2 restart helpdesk-backend --update-env
npx pm2 save
```

## 4. Run the backend with PM2

Use only one process on port `3000`. If an old manually started Node process is using the port, find it:

```bash
sudo ss -ltnp | grep ':3000'
npx pm2 pid helpdesk-backend
```

Stop the old listener using its actual PID, then start PM2:

```bash
sudo kill <OLD_PID>
cd ~/AU-Campus-HelpDesk/backend
npx pm2 delete helpdesk-backend
npx pm2 start server.js --name helpdesk-backend
npx pm2 save
```

Enable startup after reboot once:

```bash
npx pm2 startup
```

Run the `sudo env PATH=...` command printed by PM2, then:

```bash
npx pm2 save
```

## 5. Deploy the frontend

```bash
sudo rsync -a --delete \
  ~/AU-Campus-HelpDesk/frontend/dist/ \
  /var/www/au-helpdesk/

sudo nginx -t
sudo systemctl reload nginx
```

## 6. Required Nginx API proxy

The active Nginx site is `/etc/nginx/sites-available/au-helpdesk`. It must contain:

```nginx
location /helpdesk/api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 7. Verify the deployment

```bash
curl https://badproject1.centralindia.cloudapp.azure.com/helpdesk/api/health
npx pm2 status
```

Expected health response:

```json
{"message":"Campus IT HelpDesk API is running"}
```

Test the Microsoft route with a deliberately invalid token:

```bash
curl -i -X POST \
  https://badproject1.centralindia.cloudapp.azure.com/helpdesk/api/users/login/microsoft \
  -H 'Content-Type: application/json' \
  -d '{"idToken":"test"}'
```

A `401` response is expected. `404` means the wrong backend process or old code is running. `503` means the VM `.env` is missing Microsoft settings. An `unexpected "aud" claim value` error means the backend and frontend client IDs do not match.

## 8. Microsoft Entra redirect URI

Register this URI under the app registration's **Single-page application** platform:

```text
https://badproject1.centralindia.cloudapp.azure.com/redirect.html
```

Keep the local URI registered too:

```text
http://localhost:5173/redirect.html
```

After deployment, open the HTTPS URL and hard-refresh with `Cmd + Shift + R`.
