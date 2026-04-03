
import {is} from "../is.js"
import {ok, err} from "../ok/index.js"

/** drill into an object/array tree and return the value at the given path */
export function dig<Value>(
		target: any,
		path: (string | number)[],
	) {

	let current: any = target

	for (const key of path) {
		if (!(is.object(current) || is.array(current)))
			return err("not traversable" as const)

		if (!Object.hasOwn(current, key))
			return err("not found" as const)

		current = current[key]
	}

	return ok(current as Value)
}

