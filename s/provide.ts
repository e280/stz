
import {obMap} from "./ob.js"

export function provide<
		X,
		Fns extends Record<string, (x: X) => any>
	>(x: X, fns: Fns) {

	return obMap(fns, fn => fn(x)) as {
		[K in keyof Fns]: ReturnType<Fns[K]>
	}
}

