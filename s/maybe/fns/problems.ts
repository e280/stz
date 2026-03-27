
import {Maybe} from "../types.js"

export function problems(maybe: Maybe<unknown>) {
	return maybe.yay
		? undefined
		: maybe.problems
}

