// Client-side decryption for the event data files.
//
// SECURITY NOTE: this is a fully static client app, so the decryption key has
// to ship inside the JS bundle. That means this is *obfuscation* — it stops
// casual scraping of the raw /data/*.json files, but it is NOT protection
// against someone who inspects the bundle. For real confidentiality the data
// would have to be decrypted on a server. The passphrase comes from the
// VITE_DATA_KEY env var (shared with the build-time encryptor in vite.config.js)
// and falls back to a default so the app works out of the box.
export const DATA_KEY =
  import.meta.env.VITE_DATA_KEY || 'op-events-default-data-key-change-me'

let keyPromise

// Derive a 256-bit AES-GCM key from the passphrase (SHA-256), cached so we only
// import it once. Must match the derivation used at build time.
function getKey() {
  if (!keyPromise) {
    keyPromise = (async () => {
      const material = new TextEncoder().encode(DATA_KEY)
      const hash = await crypto.subtle.digest('SHA-256', material)
      return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['decrypt'])
    })()
  }
  return keyPromise
}

// Decrypts a payload produced by the build-time encryptor. Layout of the bytes:
//   [ iv (12 bytes) | ciphertext | GCM auth tag (16 bytes) ]
// Returns the parsed JSON object.
export async function decryptData(buffer) {
  const bytes = new Uint8Array(buffer)
  const iv = bytes.subarray(0, 12)
  const data = bytes.subarray(12)
  const key = await getKey()
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return JSON.parse(new TextDecoder().decode(plain))
}
