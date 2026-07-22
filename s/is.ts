
/** not null or undefined */
export function happy<X>(x: X): x is NonNullable<X> {
	return x !== undefined && x !== null
}

/** null or undefined */
export function sad(x: any): x is (undefined | null) {
	return x === undefined || x === null
}

export const is = Object.freeze({

	/** not null or undefined */
	happy,

	/** null or undefined */
	sad,

	boolean: (x: any): x is boolean =>
		typeof x === "boolean",

	number: (x: any): x is number =>
		typeof x === "number",

	string: (x: any): x is string =>
		typeof x === "string",

	bigint: (x: any): x is bigint =>
		typeof x === "bigint",

	object: <X>(x: X): x is object & NonNullable<X> =>
		typeof x === "object" && x !== null,

	array: (x: any | any[]): x is any[] =>
		Array.isArray(x),

	fn: (x: any): x is (...a: any[]) => any =>
		typeof x === "function",

	symbol: (x: any): x is symbol =>
		typeof x === "symbol",
})

