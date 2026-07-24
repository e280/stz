
import {Maybe} from "../types.js"

export function gotYay<X>(maybe: Maybe<X>) {
	if (!maybe.yay) throw new Error(maybe.problems.join("; "))
	return maybe.value
}

export function gotNay<X>(maybe: Maybe<X>) {
	if (maybe.yay) throw new Error("didn't get needed problems")
	return maybe.problems
}

/** @deprecated renamed to `gotYay` */
export const require = gotYay

