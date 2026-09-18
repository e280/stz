
import {Random} from "./types.js"

const step = 0x6D2B79F5
const scale = 0x100000000
const encoder = new TextEncoder()

export function rand32() {
	return crypto.getRandomValues(new Uint32Array(1))[0]!
}

function mix32(x: number) {
	x = Math.imul(x ^ (x >>> 15), x | 1)
	x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
	x ^= x >>> 14
	return x >>> 0
}

function string32(text: string) {
	let hash = 0x811C9DC5

	for (const byte of encoder.encode(text)) {
		hash ^= byte
		hash = Math.imul(hash, 0x01000193)
	}

	return mix32(hash)
}

export function hash32(...values: (number | string)[]) {
	let hash = 0x9E3779B9

	for (const value of values) {
		const u32 = typeof value === "string"
			? string32(value)
			: value >>> 0

		hash = (hash + step) >>> 0
		hash ^= mix32(u32)
		hash = mix32(hash)
	}

	return hash
}

export function mulberry(
		u32 = rand32(),
		...salts: (number | string)[]
	): Random {

	let state = salts.length
		? hash32(u32, ...salts)
		: u32 >>> 0

	return () => {
		state = (state + step) >>> 0
		return mix32(state) / scale
	}
}

