
import {Txt} from "../data/txt.js"
import {Bytes} from "../data/bytes.js"

export type Entry = [name: string, data: Uint8Array]

const u32len = 4
const magic = Txt.toBytes("TOQ\x01")

function u32(n: number) {
	const view = new DataView(new ArrayBuffer(u32len))
	view.setUint32(0, n, true)
	return new Uint8Array(view.buffer)
}

export function pack(items: Iterable<Entry>) {
	return new Uint8Array([
		...magic,
		...[...items].flatMap(([name, data]) => {
			const nameBytes = new TextEncoder().encode(name)
			if (nameBytes.length > 255) throw new Error("name cannot exceed 255 bytes")
			return [
				nameBytes.length,
				...nameBytes,
				...u32(data.length),
				...data,
			]
		})
	])
}

export function* unpack(file: Uint8Array) {
	if (!is(file)) throw new Error("file is not a toq archive")

	const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
	let cursor = magic.length

	while (cursor < file.length) {
		const nameLen = file[cursor]
		cursor += 1

		const name = Txt.fromBytes(file.slice(cursor, cursor + nameLen))
		cursor += nameLen

		const dataLen = view.getUint32(cursor, true)
		cursor += u32len

		if ((cursor + dataLen) > file.length) throw new Error("corrupt toq archive")
		const data = file.slice(cursor, cursor + dataLen)
		cursor += dataLen

		yield [name, data] as Entry
	}
}

export function is(file: Uint8Array) {
	return Bytes.eq(
		file.slice(0, magic.length),
		magic,
	)
}

