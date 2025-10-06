
import {Txt} from "../data/txt.js"
import {Bytes} from "../data/bytes.js"

export type Entry = [name: string, data: Uint8Array]

export const magic = new Uint8Array([...Txt.toBytes("TOQ"), 0x01])

export function from(items: Iterable<Entry>) {
	return new Uint8Array([
		...magic,
		...[...items].flatMap(([name, data]) => {
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

export function* entries(file: Uint8Array) {
	if (!is(file)) throw new Error("file is not a toq archive")

	const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
	let cursor = magic.length

	while (cursor < file.length) {
		const nameLen = file[cursor++]
		const name = Txt.fromBytes(file.slice(cursor, cursor + nameLen))
		cursor += nameLen

		const dataLen = Number(view.getBigUint64(cursor, true))
		cursor += 8
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

function u64(n: number | bigint) {
	const view = new DataView(new ArrayBuffer(8))
	view.setBigUint64(0, BigInt(n), true)
	return new Uint8Array(view.buffer)
}

