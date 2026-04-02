
/** success */
export type Ok<Value> = {ok: true, value: Value}

/** failure */
export type Err<E> = {ok: false, error: E}

/** success or failure */
export type Result<Value, E = unknown> = (
	| Ok<Value>
	| Err<E>
)

/** success */
export function ok<Value>(value: Value): Ok<Value> {
	return {ok: true, value}
}

/** failure */
export function err<E = string>(error: E): Err<E> {
	return {ok: false, error}
}

/** get value or undefined */
export function grab<Value>(result: Result<Value, unknown>): Value | undefined {
	return result.ok
		? result.value
		: undefined
}

/** get value or throw error */
export function need<Value, E>(result: Result<Value, E>): Value {
	if (result.ok)
		return result.value

	const {error} = result

	if (error instanceof Error)
		throw error

	else if (typeof error === "string")
		throw new Error(error)

	else
		throw new Error("unknown")
}

