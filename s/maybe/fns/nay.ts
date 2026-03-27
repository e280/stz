
import {Nay} from "../types.js"

export function nay(...problems: string[]): Nay {
	return {yay: false, problems}
}

