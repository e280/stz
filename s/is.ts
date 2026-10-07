
/** is not null or undefined */
export function isHappy<X>(x: X): x is NonNullable<X> {
	return x !== undefined && x !== null
}

/** is null or undefined */
export function isSad(x: any): x is (undefined | null) {
	return x === undefined || x === null
}

export const isBoolean = (x: any): x is boolean =>
	typeof x === "boolean"

export const isNumber = (x: any): x is number =>
	typeof x === "number"

export const isString = (x: any): x is string =>
	typeof x === "string"

export const isBigint = (x: any): x is bigint =>
	typeof x === "bigint"

export const isObject = <X>(x: X): x is object & NonNullable<X> =>
	typeof x === "object" && x !== null

export const isArray = (x: any | any[]): x is any[] =>
	Array.isArray(x)

export const isFn = (x: any): x is (...a: any[]) => any =>
	typeof x === "function"

export const isSymbol = (x: any): x is symbol =>
	typeof x === "symbol"

/////////////////////////////////////////

/** not null or undefined
 * @deprecated renamed to `isHappy`
 */
export function happy<X>(x: X): x is NonNullable<X> {
	return x !== undefined && x !== null
}

/** null or undefined
 * @deprecated renamed to `isHappy`
 */
export function sad(x: any): x is (undefined | null) {
	return x === undefined || x === null
}

/** @deprecated please use `isNumber` instead of `is.number`, etc */
export const is = Object.freeze({

	/** not null or undefined */
	happy,

	/** null or undefined */
	sad,

	/** @deprecated renamed to `isBoolean` */
	boolean: (x: any): x is boolean =>
		typeof x === "boolean",

	/** @deprecated renamed to `isNumber` */
	number: (x: any): x is number =>
		typeof x === "number",

	/** @deprecated renamed to `isString` */
	string: (x: any): x is string =>
		typeof x === "string",

	/** @deprecated renamed to `isBigint` */
	bigint: (x: any): x is bigint =>
		typeof x === "bigint",

	/** @deprecated renamed to `isObject` */
	object: <X>(x: X): x is object & NonNullable<X> =>
		typeof x === "object" && x !== null,

	/** @deprecated renamed to `isArray` */
	array: (x: any | any[]): x is any[] =>
		Array.isArray(x),

	/** @deprecated renamed to `isFn` */
	fn: (x: any): x is (...a: any[]) => any =>
		typeof x === "function",

	/** @deprecated renamed to `isSymbol` */
	symbol: (x: any): x is symbol =>
		typeof x === "symbol",
})

