const express = require("express");

const router = express.Router();

const ALLOWED_TYPES = new Set([
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "TXT",
  "SOA",
  "CAA",
  "SRV",
  "PTR"
]);

function isValidDnsName(value) {
  if (!value || value.length > 253) {
    return false;
  }

  const normalized = value.endsWith(".")
    ? value.slice(0, -1)
    : value;

  const labels = normalized.split(".");

  return labels.every((label) => {
    if (label.length < 1 || label.length > 63) {
      return false;
    }

    return /^[a-zA-Z0-9_](?:[a-zA-Z0-9_-]{0,61}[a-zA-Z0-9_])?$/.test(
      label
    );
  });
}

router.get("/", async (req, res) => {
  const name = String(req.query.name || "")
    .trim()
    .toLowerCase();

  const type = String(req.query.type || "A")
    .trim()
    .toUpperCase();

  if (!isValidDnsName(name)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid DNS name."
    });
  }

  if (!ALLOWED_TYPES.has(type)) {
    return res.status(400).json({
      success: false,
      message: "Unsupported DNS record type.",
      allowedTypes: Array.from(ALLOWED_TYPES)
    });
  }

  const googleUrl = new URL("https://dns.google/resolve");

  googleUrl.searchParams.set("name", name);
  googleUrl.searchParams.set("type", type);
  googleUrl.searchParams.set("do", "1");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(googleUrl, {
      method: "GET",
      headers: {
        Accept: "application/dns-json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Google DNS returned an HTTP error.",
        upstreamStatus: response.status
      });
    }

    const result = await response.json();

    return res.json({
      success: result.Status === 0,
      dnsStatus: result.Status,
      dnssecValidated: Boolean(result.AD),
      question: result.Question || [],
      answers: result.Answer || [],
      authority: result.Authority || [],
      comment: result.Comment || null
    });
  } catch (error) {
    const timedOut = error.name === "AbortError";

    return res.status(502).json({
      success: false,
      message: timedOut
        ? "Google DNS request timed out."
        : "Unable to contact Google DNS."
    });
  } finally {
    clearTimeout(timeout);
  }
});

module.exports = router;
