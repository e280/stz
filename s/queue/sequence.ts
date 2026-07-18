
import {queue} from "./queue.js"

export function sequence(limit = Infinity) {
	return queue((fn: () => Promise<unknown>) => fn(), limit) as (
		<R>(fn: () => Promise<R>) => Promise<R>
	)
}

