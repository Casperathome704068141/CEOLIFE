export interface EncryptedPayload {
  cipher: ArrayBuffer;
  iv: Uint8Array;
  checksum: string;
  size: number;
}

export async function generateVaultKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function importVaultKey(raw: string): Promise<CryptoKey> {
  const bytes = Uint8Array.from(atob(raw), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

export async function exportVaultKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  const bytes = new Uint8Array(raw);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export async function encryptFile(file: File, key: CryptoKey): Promise<EncryptedPayload> {
  const buffer = await file.arrayBuffer();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buffer);
  const checksum = await digest(buffer);
  return { cipher, iv, checksum, size: file.size };
}

export async function decryptFile(payload: EncryptedPayload, key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: payload.iv }, key, payload.cipher);
}

export async function digest(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function digestFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return digest(buffer);
}
