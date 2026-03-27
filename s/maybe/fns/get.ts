
import {Maybe} from "../types.js"

export function get<X>(maybe: Maybe<X>) {
	return maybe.yay
		? maybe.value
		: undefined
}

