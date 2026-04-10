
import type {Err} from "../types/err.js"

/** failure */
export function err<E>(error: E): Err<E> {
	return {ok: false, error}
}

