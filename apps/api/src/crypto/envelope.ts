import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DATA_KEY_LENGTH = 32;

export interface EncryptResult {
  ciphertext: Buffer;
  encryptedDataKey: Buffer;
}

export interface CryptoService {
  encrypt(plaintext: string): EncryptResult;
  decrypt(ciphertext: Buffer, encryptedDataKey: Buffer): string;
  hmac(value: string): string;
  hmacArray(values: string[]): string;
}

export function createCryptoService(
  masterKeyHex: string,
  hmacSecretHex: string,
): CryptoService {
  const masterKey = Buffer.from(masterKeyHex, "hex");
  const hmacSecret = Buffer.from(hmacSecretHex, "hex");

  if (masterKey.length !== 32) {
    throw new Error("MASTER_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }
  if (hmacSecret.length !== 32) {
    throw new Error("HMAC_SECRET must be 32 bytes (64 hex chars)");
  }

  function encryptWithKey(plaintext: Buffer, key: Buffer): Buffer {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Format: IV (12) + authTag (16) + ciphertext
    return Buffer.concat([iv, authTag, encrypted]);
  }

  function decryptWithKey(packed: Buffer, key: Buffer): Buffer {
    const iv = packed.subarray(0, IV_LENGTH);
    const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  return {
    encrypt(plaintext: string): EncryptResult {
      // Generate random data key
      const dataKey = randomBytes(DATA_KEY_LENGTH);
      // Encrypt plaintext with data key
      const ciphertext = encryptWithKey(Buffer.from(plaintext, "utf-8"), dataKey);
      // Encrypt data key with master key
      const encryptedDataKey = encryptWithKey(dataKey, masterKey);
      return { ciphertext, encryptedDataKey };
    },

    decrypt(ciphertext: Buffer, encryptedDataKey: Buffer): string {
      // Decrypt data key with master key
      const dataKey = decryptWithKey(encryptedDataKey, masterKey);
      // Decrypt ciphertext with data key
      const plaintext = decryptWithKey(ciphertext, dataKey);
      return plaintext.toString("utf-8");
    },

    hmac(value: string): string {
      return createHmac("sha256", hmacSecret).update(value).digest("hex");
    },

    hmacArray(values: string[]): string {
      const sorted = [...values].sort().join("|");
      return createHmac("sha256", hmacSecret).update(sorted).digest("hex");
    },
  };
}
