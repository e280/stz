
import {isHappy} from "./is.js"

/** when truthy, do something. */
export function when<Y>(
		x: unknown,
		yes: () => Y,
		no?: () => void,
	): Y | void {

	return x
		? yes()
		: no?.()
}

/** given a non-null non-undefined thing, do something with it. */
export function given<X, Y>(
		x: X,
		yes: (x: NonNullable<X>) => Y,
		no?: () => void,
	): Y | void {

	return isHappy(x)
		? yes(x)
		: no?.()
}

