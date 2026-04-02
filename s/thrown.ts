
export function thrown(fn: () => unknown): any {
	try { fn() }
	catch (error) { return error }
	throw new Error("didn't throw")
}

