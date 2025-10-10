
import {clone} from "./clone.js"
import {Science, expect} from "@e280/science"

function checkMapOrSetEquality(original: any, cloned: any) {
	const originalEntries = JSON.stringify(Array.from(original))
	const clonedEntries = JSON.stringify(Array.from(cloned))
	expect(clonedEntries).is(originalEntries)
	expect(cloned).not.is(original) // check for deep cloning
}

export default Science.suite({

	async "clone primitive types"() {
		expect(clone(123)).is(123)
		expect(clone("abc")).is("abc")
		expect(clone(true)).is(true)
	},

	async "clone arrays"() {
		const array = [1, 2, 3]
		const clonedArray = clone(array)
		expect(JSON.stringify(clonedArray)).is(JSON.stringify(array))
		expect(clonedArray).not.is(array) // check for deep cloning
	},

	async "clone plain objects"() {
		const object = {foo: "bar", baz: 123}
		const clonedObject = clone(object)
		expect(JSON.stringify(clonedObject)).is(JSON.stringify(object))
		expect(clonedObject).not.is(object) // check for deep cloning
	},

	async "clone Map"() {
		const map = new Map()
		map.set("key", "value")
		const clonedMap = clone(map)
		expect(map.get("key")).is("value")
		expect(clonedMap).not.is(map)
	},

	async "clone Set"() {
		const set = new Set()
		set.add("value")
		const clonedSet = clone(set)
		expect(clonedSet.has("value")).ok()
		expect(clonedSet).not.is(set)
	},

	async "clone Date"() {
		const date = new Date()
		const clonedDate = clone(date)
		expect(clonedDate.getTime()).is(date.getTime())
		expect(clonedDate).not.is(date) // check for deep cloning
	},

	async "clone objects with circular reference"() {
		const object: any = {foo: "bar"}
		object.self = object // create circular reference
		let error: any
		try {
			clone(object)
		} catch (e) {
			error = e
		}
		expect(error).not.is(undefined)
		expect(error instanceof Error).ok()
	},

	async "clone nested objects"() {
		const object = {foo: "bar", inner: {baz: 123, deeper: {qux: true}}}
		const clonedObject = clone(object)
		expect(JSON.stringify(clonedObject)).is(JSON.stringify(object))
		expect(clonedObject).not.is(object) // check for deep cloning
		expect(clonedObject.inner).not.is(object.inner) // check for deep cloning
		expect(clonedObject.inner.deeper).not.is(object.inner.deeper) // check for deep cloning
	},

	async "clone array of objects"() {
		const array = [{foo: "bar"}, {baz: 123}, {qux: true}]
		const clonedArray = clone(array)
		expect(JSON.stringify(clonedArray)).is(JSON.stringify(array))
		expect(clonedArray).not.is(array) // check for deep cloning
	},

	async "clone object with array"() {
		const object = {foo: "bar", array: [1, 2, 3]}
		const clonedObject = clone(object)
		expect(JSON.stringify(clonedObject)).is(JSON.stringify(object))
		expect(clonedObject).not.is(object) // check for deep cloning
	},

	async "clone object with Map"() {
		const map = new Map()
		map.set("key", "value")
		const object = {foo: "bar", map}
		const clonedObject = clone(object)
		expect(JSON.stringify(clonedObject.foo)).is(JSON.stringify(object.foo))
		checkMapOrSetEquality(object.map, clonedObject.map)
	},

	async "clone object with duplicate sibling references"() {
		const dupeObject = { id: 1, name: "H4CK3RM4N" }
		const data = { obj1: dupeObject, obj2: dupeObject }

		let didThrow = false
		let clonedData: typeof data = {} as typeof data

		try {
			clonedData = clone(data)
		}
		catch (error) {
			didThrow = true
		}

		expect(didThrow).not.is(true)
		expect(clonedData.obj1).not.is(clonedData.obj2)
		expect(clonedData.obj1.id).is(1)
		expect(clonedData.obj1.name).is("H4CK3RM4N")
		expect(clonedData.obj2.id).is(1)
		expect(clonedData.obj2.name).is("H4CK3RM4N")
	},
})

