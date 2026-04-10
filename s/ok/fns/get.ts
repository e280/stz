
import type {Result} from "../types/result.js"

/** get value or undefined */
export function getOk<Value>(result: Result<Value, unknown>): Value | undefined {
	return result.ok
		? result.value
		: undefined
}

/** get error or undefined */
export function getErr<E = string>(result: Result<unknown, E>): E | undefined {
	return result.ok
		? undefined
		: result.error
}

/** @deprecated renamed to `getOk` */
export const grab = getOk

