
import {deepEqual} from "./equal.js"
import {Science, expect} from "@e280/science"

export default Science.suite({
	async "compare primitive types"() {
		expect(deepEqual(123, 123)).is(true)
		expect(deepEqual("abc", "abc")).is(true)
		expect(deepEqual(true, true)).is(true)
		expect(deepEqual(123, "123")).is(false)
		expect(deepEqual(true, 1)).is(false)
	},

	async "compare arrays"() {
		const array1 = [1, 2, 3]
		const array2 = [1, 2, 3]
		const array3 = [1, 2, 4]
		expect(deepEqual(array1, array2)).is(true)
		expect(deepEqual(array1, array3)).is(false)
	},

	async "compare plain objects"() {
		const obj1 = { foo: "bar", baz: 123 }
		const obj2 = { foo: "bar", baz: 123 }
		const obj3 = { foo: "bar", baz: 124 }
		expect(deepEqual(obj1, obj2)).is(true)
		expect(deepEqual(obj1, obj3)).is(false)
	},

	async "compare nested objects"() {
		const obj1 = { foo: "bar", inner: { baz: 123, deeper: { qux: true }}}
		const obj2 = { foo: "bar", inner: { baz: 123, deeper: { qux: true }}}
		const obj3 = { foo: "bar", inner: { baz: 124, deeper: { qux: true }}}
		expect(deepEqual(obj1, obj2)).is(true)
		expect(deepEqual(obj1, obj3)).is(false)
	},

	async "compare array of objects"() {
		const arr1 = [{ foo: "bar" }, { baz: 123 }, { qux: true }]
		const arr2 = [{ foo: "bar" }, { baz: 123 }, { qux: true }]
		const arr3 = [{ foo: "bar" }, { baz: 123 }, { qux: false }]
		expect(deepEqual(arr1, arr2)).is(true)
		expect(deepEqual(arr1, arr3)).is(false)
	},

	async "compare null and undefined"() {
		expect(deepEqual(null, null)).is(true)
		expect(deepEqual(undefined, undefined)).is(true)
		expect(deepEqual(null, undefined)).is(false)
	},

	async "compare with nested arrays"() {
		const obj1 = { foo: "bar", array: [1, 2, [3, 4]] }
		const obj2 = { foo: "bar", array: [1, 2, [3, 4]] }
		const obj3 = { foo: "bar", array: [1, 2, [3, 5]] }
		expect(deepEqual(obj1, obj2)).is(true)
		expect(deepEqual(obj1, obj3)).is(false)
	},

	async "circularity is forbidden"() {
		const obj1 = {alpha: 1} as any
		const obj2 = {alpha: 1} as any
		obj1.bravo = obj1
		obj2.bravo = obj2
		expect(() => deepEqual(obj1, obj2)).throws()
	},

	async "duplicate references are allowed"() {
		const dupe = {a: 123}
		const obj1 = {alpha: 1, dupe}
		const obj2 = {alpha: 1, dupe}
		const obj3 = {alpha: 1, dupe: {a: 0}}
		expect(deepEqual(obj1, obj2)).is(true)
		expect(deepEqual(obj1, obj3)).is(false)
	},

	"maps and sets": {
		async "compare maps"() {
			const map1 = new Map([['key1', 'value1'], ['key2', 'value2']])
			const map2 = new Map([['key1', 'value1'], ['key2', 'value2']])
			const map3 = new Map([['key1', 'value1'], ['key2', 'value3']])
			expect(deepEqual(map1, map2)).is(true)
			expect(deepEqual(map1, map3)).is(false)
		},

		async "compare sets"() {
			const set1 = new Set([1, 2, 3])
			const set2 = new Set([1, 2, 3])
			const set3 = new Set([1, 2, 4])
			expect(deepEqual(set1, set2)).is(true)
			expect(deepEqual(set1, set3)).is(false)
		},

		async "compare nested maps and sets"() {
			const obj1 = { map: new Map([['key', new Set([1, 2, 3])]]) }
			const obj2 = { map: new Map([['key', new Set([1, 2, 3])]]) }
			const obj3 = { map: new Map([['key', new Set([1, 2, 4])]]) }
			expect(deepEqual(obj1, obj2)).is(true)
			expect(deepEqual(obj1, obj3)).is(false)
		},

		async "compare complex structures"() {
			const map1 = new Map([['set', new Set([{ a: 1 }, { b: 2 }])]])
			const map2 = new Map([['set', new Set([{ a: 1 }, { b: 2 }])]])
			const map3 = new Map([['set', new Set([{ a: 1 }, { b: 3 }])]])
			expect(deepEqual(map1, map2)).is(true)
			expect(deepEqual(map1, map3)).is(false)
		},

		async "compare edge cases"() {
			const emptyMap1 = new Map()
			const emptyMap2 = new Map()
			const emptySet1 = new Set()
			const emptySet2 = new Set()
			const mixedMap1 = new Map([['b', 2], ['a', 1]])
			const mixedMap2 = new Map([['a', 1], ['b', 2]])
			expect(deepEqual(emptyMap1, emptyMap2)).is(true)
			expect(deepEqual(emptySet1, emptySet2)).is(true)
			expect(deepEqual(mixedMap1, mixedMap2)).is(true)
		},
	},
})

