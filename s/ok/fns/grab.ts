
import type {Result} from "../types/result.js"

/** get value or undefined */
export function grab<Value>(result: Result<Value, unknown>): Value | undefined {
	return result.ok
		? result.value
		: undefined
}

