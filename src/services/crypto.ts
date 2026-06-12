/**
 * AES-GCM Encryption and Decryption Service
 * 
 * Note: Key material derived from WebAuthn PRF.
 */

// Generate a random IV for AES-GCM
export function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

// Convert a base64 or base64url string to a Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  // WebAuthn uses base64url, so we replace - and _ with + and /
  let b64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if missing
  const padLen = (4 - (b64.length % 4)) % 4;
  if (padLen > 0) {
    b64 += '='.repeat(padLen);
  }
  
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert a Uint8Array to a base64 string
export function uint8ArrayToBase64(bytes: Uint8Array | ArrayBuffer): string {
  const uint8 = new Uint8Array(bytes);
  let binaryString = "";
  for (let i = 0; i < uint8.length; i++) {
    binaryString += String.fromCharCode(uint8[i]);
  }
  return btoa(binaryString);
}

// Import raw key bytes into an AES-GCM CryptoKey
export async function importKeyFromBytes(rawKeyBytes: Uint8Array): Promise<CryptoKey> {
  // WebAuthn PRF returns 32 bytes (256 bits).
  // If it's more/less we hash it to ensure 256 bits for AES-256-GCM.
  const hash = await window.crypto.subtle.digest("SHA-256", rawKeyBytes as BufferSource);

  return window.crypto.subtle.importKey(
    "raw",
    hash,
    "AES-GCM",
    false, // not extractable
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(plaintext: string, key: CryptoKey): Promise<{ ciphertextBase64: string; ivBase64: string }> {
  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);
  const iv = generateIV();

  const ciphertextBuf = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    encodedPlaintext
  );

  return {
    ciphertextBase64: uint8ArrayToBase64(new Uint8Array(ciphertextBuf)),
    ivBase64: uint8ArrayToBase64(iv),
  };
}

export async function decryptData(ciphertextBase64: string, ivBase64: string, key: CryptoKey): Promise<string> {
  const ciphertextBytes = base64ToUint8Array(ciphertextBase64);
  const iv = base64ToUint8Array(ivBase64);

  const decryptedBuf = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    ciphertextBytes as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuf);
}
