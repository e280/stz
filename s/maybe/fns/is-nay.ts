
import {Maybe, Nay} from "../types.js"

export function isNay(maybe: Maybe<any>): maybe is Nay {
	return !maybe.yay
}

