const DEFAULT_ALLOWED_DOMAIN = "au.edu";

let cachedVerifier = null;
let cachedConfigKey = null;

function getMicrosoftAuthConfig() {
  const tenantId = String(process.env.MICROSOFT_TENANT_ID || "").trim();
  const clientId = String(process.env.MICROSOFT_CLIENT_ID || "").trim();
  const allowedDomain = String(
    process.env.MICROSOFT_ALLOWED_DOMAIN || DEFAULT_ALLOWED_DOMAIN
  )
    .trim()
    .toLowerCase()
    .replace(/^@/, "");

  if (!tenantId || !clientId) {
    const error = new Error(
      "Microsoft sign-in is not configured. Set MICROSOFT_TENANT_ID and MICROSOFT_CLIENT_ID."
    );
    error.code = "MICROSOFT_AUTH_NOT_CONFIGURED";
    throw error;
  }

  return { tenantId, clientId, allowedDomain };
}

async function getVerifier(config) {
  const configKey = `${config.tenantId}:${config.clientId}`;
  if (cachedVerifier && cachedConfigKey === configKey) return cachedVerifier;

  const { createRemoteJWKSet, jwtVerify } = await import("jose");
  const issuer = `https://login.microsoftonline.com/${config.tenantId}/v2.0`;
  const jwks = createRemoteJWKSet(
    new URL(`https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`)
  );

  cachedConfigKey = configKey;
  cachedVerifier = async (idToken) =>
    jwtVerify(idToken, jwks, {
      algorithms: ["RS256"],
      audience: config.clientId,
      issuer,
    });

  return cachedVerifier;
}

function getEmail(payload) {
  const candidates = [payload.preferred_username, payload.email, payload.upn];
  return candidates.find((value) => typeof value === "string" && value.includes("@"));
}

async function verifyMicrosoftIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    const error = new Error("A Microsoft ID token is required.");
    error.code = "INVALID_MICROSOFT_TOKEN";
    throw error;
  }

  const config = getMicrosoftAuthConfig();
  const verify = await getVerifier(config);
  const { payload } = await verify(idToken);

  if (payload.tid !== config.tenantId) {
    const error = new Error("This Microsoft account does not belong to the AU tenant.");
    error.code = "MICROSOFT_TENANT_NOT_ALLOWED";
    throw error;
  }

  const email = getEmail(payload)?.trim().toLowerCase();
  const domain = email?.split("@").pop();
  if (!email || domain !== config.allowedDomain) {
    const error = new Error(`Please sign in with your @${config.allowedDomain} account.`);
    error.code = "MICROSOFT_DOMAIN_NOT_ALLOWED";
    throw error;
  }

  const microsoftId = payload.oid || payload.sub;
  if (!microsoftId || typeof microsoftId !== "string") {
    const error = new Error("The Microsoft account token has no stable user identifier.");
    error.code = "INVALID_MICROSOFT_TOKEN";
    throw error;
  }

  return {
    microsoftId,
    email,
    name: String(payload.name || email.split("@")[0]).trim(),
  };
}

module.exports = { verifyMicrosoftIdToken };
