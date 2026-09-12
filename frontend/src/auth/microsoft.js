import { PublicClientApplication } from "@azure/msal-browser";

const tenantId = String(import.meta.env.VITE_MICROSOFT_TENANT_ID || "").trim();
const clientId = String(import.meta.env.VITE_MICROSOFT_CLIENT_ID || "").trim();

let clientPromise = null;

export function isMicrosoftConfigured() {
  return Boolean(tenantId && clientId);
}

async function getMicrosoftClient() {
  if (!isMicrosoftConfigured()) {
    throw new Error(
      "Microsoft sign-in is not configured. Add the Entra tenant and client IDs to frontend/.env."
    );
  }

  if (!clientPromise) {
    const client = new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
      },
      cache: {
        cacheLocation: "sessionStorage",
      },
    });
    clientPromise = client.initialize().then(() => client);
  }

  return clientPromise;
}

export async function signInWithMicrosoft() {
  const client = await getMicrosoftClient();
  const result = await client.loginPopup({
    scopes: ["openid", "profile", "email"],
    prompt: "select_account",
    extraQueryParameters: { domain_hint: "au.edu" },
  });

  if (!result.idToken) {
    throw new Error("Microsoft did not return an identity token.");
  }

  return result.idToken;
}
