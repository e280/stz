
import {nay} from "../fns/nay.js"
import {yay} from "../fns/yay.js"
import {Validator} from "../types.js"

export function deny<X>(
		problem: string | null | undefined,
		denied: (x: X) => boolean,
	): Validator<X> {

	return x => (
		denied(x)
			? (problem ? nay(problem) : nay())
			: yay(x)
	)
}

