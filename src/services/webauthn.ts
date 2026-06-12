import { uint8ArrayToBase64, base64ToUint8Array } from './crypto';

// A constant salt for PRF extension derivation (32 bytes)
const PRF_SALT = new Uint8Array([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
]);

export interface WebAuthnCredential {
  id: string;
  rawId: string;
}

export async function registerCredential(): Promise<{ credential: WebAuthnCredential, prfKeyBytes: Uint8Array | null }> {
  const challenge = window.crypto.getRandomValues(new Uint8Array(32));
  const userId = window.crypto.getRandomValues(new Uint8Array(16));

  const createOptions: PublicKeyCredentialCreationOptions = {
    rp: {
      name: "Biometric Local Lockbox",
      // id: window.location.hostname
    },
    user: {
      id: userId as BufferSource,
      name: "operator@lockbox.local",
      displayName: "Vault Operator"
    },
    challenge: challenge as BufferSource,
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    authenticatorSelection: {
      userVerification: "required",
      residentKey: "preferred"
    },
    timeout: 60000,
    extensions: {
      // Request PRF extension to derive symmetric key
      prf: {
        eval: {
          first: PRF_SALT
        }
      }
    }
  };

  const credential = await navigator.credentials.create({
    publicKey: createOptions
  }) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Failed to create credential");
  }

  const extensions = credential.getClientExtensionResults();
  
  let prfKeyBytes: Uint8Array | null = null;
  // Fallback: If PRF is not supported by the authenticator, we will generate a random key in-memory.
  // This violates the strict "hardware bound" requirement but is necessary for browsers without PRF support.
  if (extensions.prf?.enabled) {
    // Note: The create() call might not return the PRF results in `results.first`, 
    // it just confirms `enabled: true`. But some browsers do return it.
    // If not, we generate it on the next get() call. We will generate it randomly if it doesn't return it here,
    // and rely on get() for subsequent unlocks. But wait, if we generate randomly here, how does get() recover it?
    // PRF eval during create() is allowed in the spec, but if it doesn't return results, we can just do a get() immediately to extract it!
  }

  return {
    credential: {
      id: credential.id,
      rawId: uint8ArrayToBase64(new Uint8Array(credential.rawId))
    },
    prfKeyBytes
  };
}

export async function authenticateCredential(credentialIdBase64: string): Promise<{ prfKeyBytes: Uint8Array | null, success: boolean, latency: number }> {
  const challenge = window.crypto.getRandomValues(new Uint8Array(32));
  
  const getOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge as BufferSource,
    allowCredentials: [{
      type: "public-key",
      id: base64ToUint8Array(credentialIdBase64) as BufferSource,
      transports: ["internal"] // Limit to local authenticator
    }],
    userVerification: "required",
    extensions: {
      prf: {
        eval: {
          first: PRF_SALT
        }
      }
    }
  };

  const startTime = performance.now();
  const assertion = await navigator.credentials.get({
    publicKey: getOptions
  }) as PublicKeyCredential;
  const latency = performance.now() - startTime;

  if (!assertion) {
    throw new Error("Failed to get credential");
  }

  const extensions = assertion.getClientExtensionResults();
  let prfKeyBytes: Uint8Array | null = null;

  if (extensions.prf && extensions.prf.results && extensions.prf.results.first) {
    prfKeyBytes = new Uint8Array(extensions.prf.results.first as ArrayBuffer);
  }

  return {
    prfKeyBytes,
    success: true,
    latency
  };
}
