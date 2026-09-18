
import {Maybe} from "../types.js"

export function getValue<X>(maybe: Maybe<X>) {
	return maybe.yay
		? maybe.value
		: undefined
}

export function gotValue<X>(maybe: Maybe<X>) {
	if (!maybe.yay) throw new Error(maybe.problems.join("; "))
	return maybe.value
}

export function getProblems(maybe: Maybe<unknown>) {
	return maybe.yay
		? undefined
		: maybe.problems
}

export function gotProblems<X>(maybe: Maybe<X>) {
	if (maybe.yay) throw new Error("expected problems")
	return maybe.problems
}

