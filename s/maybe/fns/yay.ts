
import {Yay} from "../types.js"

export function yay<X>(value: X): Yay<X> {
	return {yay: true, value}
}

