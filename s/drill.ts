
import {is} from "./is.js"

/** return a value within an object tree, found at the given path. */
export function drill<xResult>(
		object: {[key: string]: any},
		path: string[],
	): xResult {

	let current: any = object

	for (const key of path) {
		current = current[key]
		if (is.unset(current))
			break
	}

	return current
}

