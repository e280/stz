
import {suite, expect, assert} from "@e280/science"
import {dig} from "./dig.js"
import {needOk} from "../ok/index.js"

const check = (t: any, path: (string | number)[]) => ({
	ok: (value: any) => async() => {
		const result = dig(t, path)
		expect(needOk(result)).is(value)
	},
	err: (e: any) => async() => {
		const result = dig(t, path)
		assert(!result.ok)
		expect(result.error).is(e)
	},
})

export default suite({
	"get value": check({a: 2}, ["a"])
		.ok(2),

	"get undefined": check({a: undefined}, ["a"])
		.ok(undefined),

	"get null": check({a: null}, ["a"])
		.ok(null),

	"nested get value": check({a: {b: 2}}, ["a", "b"])
		.ok(2),

	"array get value": check(["a", "b"], [1])
		.ok("b"),

	"null not traversable": check(null, ["a"])
		.err("not traversable"),

	"undefined not traversable": check(undefined, ["a"])
		.err("not traversable"),

	"missing key not found": check({a: 2}, ["b"])
		.err("not found"),

	"array index not found": check(["a", "b"], [2])
		.err("not found"),

	"midway not traversable": check({a: 5}, ["a", "b"])
		.err("not traversable"),

	"midway not found": check({a: {}}, ["a", "b"])
		.err("not found"),
})

