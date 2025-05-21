
export const is = Object.freeze({
	set: <X>(x: X): x is NonNullable<X> =>
		x !== undefined && x !== null,

	unset: (x: any): x is (undefined | null) =>
		x === undefined || x === null,

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

