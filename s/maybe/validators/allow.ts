
import {nay} from "../fns/nay.js"
import {yay} from "../fns/yay.js"
import {Validator} from "../types.js"

export function allow<X>(
		problem: string | null | undefined,
		allowed: (x: X) => boolean,
	): Validator<X> {

	return x => (
		allowed(x)
			? yay(x)
			: (problem ? nay(problem) : nay())
	)
}

