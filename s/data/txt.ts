
const fromBytes = (bytes: Uint8Array) => new TextDecoder().decode(bytes)
const toBytes = (string: string): Uint8Array => new TextEncoder().encode(string)

export function txt(bytes: Uint8Array) {
	return fromBytes(bytes)
}
txt.fromBytes = fromBytes
txt.toBytes = toBytes

/** @deprecated renamed to `fromBytes` */
txt.string = txt.fromBytes

/** @deprecated renamed to `toBytes` */
txt.bytes = txt.toBytes

/** @deprecated renamed to `txt` */
export const Txt = txt

