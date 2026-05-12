
const fromBytes = (bytes: Uint8Array) => new TextDecoder().decode(bytes)
const toBytes = (string: string): Uint8Array => new TextEncoder().encode(string)

export function txt(bytes: Uint8Array) {
	return fromBytes(bytes)
}
txt.fromBytes = fromBytes
txt.toBytes = toBytes

