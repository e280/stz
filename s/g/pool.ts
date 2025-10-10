
import {GMap} from "./map.js"

export type Identifiable<Id = any> = {id: Id}

/** js map but for things that have an `id` field */
export class GPool<V extends Identifiable> extends GMap<V["id"], V> {
	got(value: V) {
		return this.has(value.id)
	}

	add(value: V) {
		this.set(value.id, value)
		return value
	}

	remove(value: V) {
		return this.delete(value.id)
	}
}

/** @deprecated renamed to `GPool` */
export const PoolG = GPool

