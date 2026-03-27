
import {Maybe, Yay} from "../types.js"

export function isYay<X>(maybe: Maybe<X>): maybe is Yay<X> {
	return maybe.yay
}

