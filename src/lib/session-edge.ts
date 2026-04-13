const encoder = new TextEncoder();

function base64UrlToUint8Array(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function decodeJwtPayload(payloadPart: string) {
  try {
    const payloadBytes = base64UrlToUint8Array(payloadPart);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    return JSON.parse(payloadJson) as { exp?: number; nbf?: number };
  } catch {
    return null;
  }
}

export async function hasValidSessionToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const secret = process.env.JWT_SECRET || "very_secure_and_random_string_for_satt_jwt";
  const data = encoder.encode(`${headerPart}.${payloadPart}`);
  const signature = base64UrlToUint8Array(signaturePart);

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const validSignature = await crypto.subtle.verify("HMAC", key, signature, data);

    if (!validSignature) {
      return false;
    }

    const payload = decodeJwtPayload(payloadPart);

    if (!payload) {
      return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (typeof payload.nbf === "number" && nowInSeconds < payload.nbf) {
      return false;
    }

    if (typeof payload.exp === "number" && nowInSeconds >= payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
