
import {queue} from "./queue.js"

/** create a serialized execution lane for arbitrary async functions. */
export function lane(limit = Infinity) {
	return queue((fn: () => Promise<unknown>) => fn(), limit) as (
		<R>(fn: () => Promise<R>) => Promise<R>
	)
}

