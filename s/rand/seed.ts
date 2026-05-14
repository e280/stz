
import {Random} from "./types.js"
import {u32ify} from "./u32ify.js"

const m = 2147483647
const a = 48271

export function seed(u32 = u32ify(Math.random())): Random {
	u32 = (u32 ^ 0x6D2B79F5) + 0x1E35A7BD
	u32 = ((u32 >>> 0) % m) || 1

	function random() {
		u32 = (a * u32) % m
		return u32 / m
	}

	random()
	return random
}

