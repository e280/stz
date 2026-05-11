
import {is} from "./is.js"

export function got<X>(thing: X | undefined | null): X {
	if (is.sad(thing)) throw new Error(`got failed`)
	return thing
}

