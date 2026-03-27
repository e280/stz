
import {nay} from "../fns/nay.js"
import {yay} from "../fns/yay.js"
import {Validator} from "../types.js"

export function validator<X>(...validators: Validator<X>[]): Validator<X> {
	return x => {
		let failures = 0
		const probs: string[] = []

		for (const validator of validators) {
			const maybe = validator(x)
			if (!maybe.yay) {
				failures++
				probs.push(...maybe.problems)
			}
		}

		return (failures > 0)
			? nay(...probs)
			: yay(x)
	}
}

/** @deprecated renamed to `validator` */
export const all = validator

