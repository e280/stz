
import type {Ok} from "./ok.js"
import type {Err} from "./err.js"

/** success or failure */
export type Result<Value, E = unknown> = (
	| Ok<Value>
	| Err<E>
)

