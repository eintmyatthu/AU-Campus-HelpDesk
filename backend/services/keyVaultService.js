const { ClientSecretCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function loadKeyVaultSecrets() {
  console.log("Connecting to Azure Key Vault...");

  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );

  const vaultUrl = `https://${process.env.AZURE_KEY_VAULT_NAME}.vault.azure.net`;

  const client = new SecretClient(vaultUrl, credential);

  const jwtSecret = await client.getSecret("JWT-SECRET");
  if (!jwtSecret.value) {
    throw new Error("JWT-SECRET is empty");
  }

  process.env.JWT_SECRET = jwtSecret.value;
  console.log("JWT secret loaded from Azure Key Vault");
}

module.exports = { loadKeyVaultSecrets };
