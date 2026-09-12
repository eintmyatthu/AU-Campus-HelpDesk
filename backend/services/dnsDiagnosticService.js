const PROVIDER = "Google Public DNS";
const ENDPOINT = "https://dns.google/resolve";
const { isIP } = require("node:net");

function isValidHostname(value) {
  if (typeof value !== "string") return false;
  const hostname = value.toLowerCase().replace(/\.$/, "");
  if (hostname.length < 4 || hostname.length > 253 || !hostname.includes(".")) return false;
  const labels = hostname.split(".");
  if (!labels.every((label) => label.length >= 1 && label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return false;
  const tld = labels.at(-1);
  return /^[a-z]{2,63}$/.test(tld) || /^xn--[a-z0-9-]{2,59}$/.test(tld);
}

function normalizeHostname(candidate) {
  if (typeof candidate !== "string") return null;
  let value = candidate.trim().replace(/^[([{<"']+|[\])}>"',;:!?]+$/g, "");
  try {
    if (/^https?:\/\//i.test(value)) value = new URL(value).hostname;
  } catch {
    return null;
  }
  value = value.toLowerCase().replace(/\.$/, "");
  return isValidHostname(value) ? value : null;
}

function extractHostname(title, description) {
  const text = `${title || ""} ${description || ""}`;
  const candidates = text.match(/https?:\/\/[^\s<>'"]+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?:\/[^\s<>'"]*)?/gi) || [];
  for (const candidate of candidates) {
    const hostname = normalizeHostname(
      /^https?:\/\//i.test(candidate) ? candidate : candidate.split("/")[0]
    );
    if (hostname) return hostname;
  }
  return null;
}

function unavailable(hostname, reason) {
  return {
    provider: PROVIDER,
    hostname,
    resolved: false,
    status: null,
    addresses: [],
    outcome: "unavailable",
    reason
  };
}

async function diagnoseHostname(hostname, { timeoutMs = 3000 } = {}) {
  const normalized = normalizeHostname(hostname);
  if (!normalized) return unavailable(null, "invalid_hostname");

  const controller = new AbortController();
  const safeTimeout = Number.isInteger(timeoutMs) && timeoutMs > 0
    ? Math.min(timeoutMs, 10000) : 3000;
  let timer;
  try {
    const url = new URL(ENDPOINT);
    url.searchParams.set("name", normalized);
    url.searchParams.set("type", "A");
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error("DNS timeout"));
      }, safeTimeout);
    });
    const request = async () => {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: { Accept: "application/dns-json" }
      });
      if (!response.ok) return { error: `provider_http_${response.status}` };
      return { payload: await response.json() };
    };
    const { payload, error } = await Promise.race([request(), deadline]);
    if (error) return unavailable(normalized, error);
    if (!Number.isInteger(payload?.Status)) return unavailable(normalized, "malformed_response");
    const addresses = payload.Status === 0 && Array.isArray(payload.Answer)
      ? [...new Set(payload.Answer
        .filter((answer) => answer?.type === 1 && typeof answer.data === "string")
        .map((answer) => answer.data)
        .filter((address) => isIP(address) === 4))]
      : [];
    return {
      provider: PROVIDER,
      hostname: normalized,
      resolved: payload.Status === 0 && addresses.length > 0,
      status: payload.Status,
      addresses,
      outcome: payload.Status !== 0 ? "dns_error" : addresses.length ? "resolved" : "no_a_records"
    };
  } catch {
    return unavailable(normalized, controller.signal.aborted ? "timeout" : "request_failed");
  } finally {
    clearTimeout(timer);
  }
}

async function diagnoseNetworkTicket({ category, title, description }, options) {
  if (category !== "NETWORK") return { performed: false, reason: "not_network_ticket" };
  const hostname = extractHostname(title, description);
  if (!hostname) return { performed: false, reason: "no_hostname" };
  return { performed: true, ...(await diagnoseHostname(hostname, options)) };
}

module.exports = {
  diagnoseHostname,
  diagnoseNetworkTicket,
  extractHostname,
  isValidHostname,
  normalizeHostname
};
