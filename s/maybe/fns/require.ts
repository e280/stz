
import {Maybe} from "../types.js"

export function require<X>(maybe: Maybe<X>) {
	if (!maybe.yay) throw new Error(maybe.problems.join("; "))
	return maybe.value
}

