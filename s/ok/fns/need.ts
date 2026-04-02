
import type {Result} from "../types/result.js"

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

