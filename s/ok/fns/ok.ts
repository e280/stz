
import type {Ok} from "../types/ok.js"

/** success */
export function ok<Value>(value: Value): Ok<Value> {
	return {ok: true, value}
}

