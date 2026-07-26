
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

/** @deprecated renamed to `gotYay` */
export const require = gotValue

/** @deprecated renamed to `getValue` */
export const get = getValue

/** @deprecated renamed to `gotValue` */
export const gotYay = gotValue

/** @deprecated renamed to `getProblems` */
export const problems = getProblems

/** @deprecated renamed to `gotProblems` */
export const gotNay = gotProblems

