
import type {Result} from "../types/result.js"

/** return ok value, otherwise throw error */
export function needOk<Value, E>(result: Result<Value, E>): Value {
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

/** return error, otherwise throw error */
export function needErr<E>(result: Result<unknown, E>): E {
	if (result.ok) throw new Error("didn't get needed error")
	return result.error
}

/** @deprecated renamed to `needOk` */
export const need = needOk

