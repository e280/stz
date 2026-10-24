
import {isHappy} from "./is.js"

export function when<X, Y>(
		x: X,
		yes: (x: NonNullable<X>) => Y,
		no?: () => void,
	): Y | void {

	return isHappy(x)
		? yes(x)
		: no?.()
}

