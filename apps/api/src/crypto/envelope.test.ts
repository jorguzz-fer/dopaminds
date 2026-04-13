import { describe, it, expect, beforeAll } from "vitest";
import { createCryptoService, type CryptoService } from "./envelope.js";

let crypto: CryptoService;

beforeAll(() => {
  // 32 bytes hex = 64 chars
  const masterKey = "a".repeat(64);
  const hmacSecret = "b".repeat(64);
  crypto = createCryptoService(masterKey, hmacSecret);
});

describe("envelope encryption", () => {
  it("encrypts and decrypts a string", () => {
    const plaintext = "I feel stressed and want to scroll";
    const { ciphertext, encryptedDataKey } = crypto.encrypt(plaintext);

    expect(ciphertext).toBeInstanceOf(Buffer);
    expect(encryptedDataKey).toBeInstanceOf(Buffer);
    expect(ciphertext.toString()).not.toContain(plaintext);

    const decrypted = crypto.decrypt(ciphertext, encryptedDataKey);
    expect(decrypted).toBe(plaintext);
  });

  it("encrypts and decrypts JSON", () => {
    const data = { triggers: ["boredom", "stress"], notes: "hard day" };
    const json = JSON.stringify(data);
    const { ciphertext, encryptedDataKey } = crypto.encrypt(json);

    const decrypted = crypto.decrypt(ciphertext, encryptedDataKey);
    expect(JSON.parse(decrypted)).toEqual(data);
  });

  it("produces different ciphertext for same plaintext (unique IV + data key)", () => {
    const plaintext = "same input";
    const result1 = crypto.encrypt(plaintext);
    const result2 = crypto.encrypt(plaintext);

    expect(result1.ciphertext).not.toEqual(result2.ciphertext);
    expect(result1.encryptedDataKey).not.toEqual(result2.encryptedDataKey);
  });

  it("fails to decrypt with wrong master key", () => {
    const plaintext = "secret data";
    const { ciphertext, encryptedDataKey } = crypto.encrypt(plaintext);

    const wrongCrypto = createCryptoService("c".repeat(64), "b".repeat(64));
    expect(() => wrongCrypto.decrypt(ciphertext, encryptedDataKey)).toThrow();
  });
});

describe("HMAC", () => {
  it("produces consistent HMAC for same input", () => {
    const hmac1 = crypto.hmac("boredom");
    const hmac2 = crypto.hmac("boredom");
    expect(hmac1).toBe(hmac2);
  });

  it("produces different HMAC for different input", () => {
    const hmac1 = crypto.hmac("boredom");
    const hmac2 = crypto.hmac("stress");
    expect(hmac1).not.toBe(hmac2);
  });

  it("HMAC does not reveal the original value", () => {
    const hmac = crypto.hmac("boredom");
    expect(hmac).not.toContain("boredom");
    expect(hmac).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hmacArray produces sorted HMAC of joined values", () => {
    const hmac = crypto.hmacArray(["stress", "boredom"]);
    expect(hmac).toMatch(/^[a-f0-9]{64}$/);
    // Sorted, so order doesn't matter
    const hmac2 = crypto.hmacArray(["boredom", "stress"]);
    expect(hmac).toBe(hmac2);
  });
});
