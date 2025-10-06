
import {Txt} from "../data/txt.js"
import {Bytes} from "../data/bytes.js"

export const toqMagic = new Uint8Array([...new TextEncoder().encode("TOQ"), 0x01])
export type ToqItem = [name: string, data: Uint8Array]

function u64(n: number | bigint) {
	const view = new DataView(new ArrayBuffer(8))
	view.setBigUint64(0, BigInt(n), true)
	return new Uint8Array(view.buffer)
}

export function toq(...items: ToqItem[]) {
	return new Uint8Array([
		...toqMagic,
		...items.flatMap(([name, data]) => {
			const nameBytes = new TextEncoder().encode(name)
			if (nameBytes.length > 255) throw new Error("name cannot exceed 255 bytes")
			return [
				nameBytes.length,
				...nameBytes,
				...u64(data.length),
				...data,
			]
		})
	])
}

export function* untoq(file: Uint8Array) {
	if (!isToq(file)) throw new Error("file is not a toq archive")

	const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
	let cursor = toqMagic.length

	while (cursor < file.length) {
		const nameLen = file[cursor++]
		const name = Txt.fromBytes(file.slice(cursor, cursor + nameLen))
		cursor += nameLen

		const dataLen = Number(view.getBigUint64(cursor, true))
		cursor += 8
		const data = file.slice(cursor, cursor + dataLen)
		cursor += dataLen

		yield [name, data] as ToqItem
	}
}

export function isToq(file: Uint8Array) {
	const magic = file.slice(0, toqMagic.length)
	return Bytes.eq(magic, toqMagic)
}

