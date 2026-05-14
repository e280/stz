
/** convert a fraction number (between 0 and 1) into an unsigned 32-bit integer. */
export function u32ify(fraction: number) {
	return Math.floor(fraction * 0x100000000)
}

