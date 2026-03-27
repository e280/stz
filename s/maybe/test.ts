
import {expect, suite, test} from "@e280/science"
import {maybe, yay, nay, allow, deny} from "./index.js"

export default suite({
	fns: {
		"get": test(async() => {
			expect(maybe.get(yay(123))).is(123)
			expect(maybe.get(nay("nope"))).is(undefined)
		}),

		"isNay": test(async() => {
			expect(maybe.isNay(yay(123))).is(false)
			expect(maybe.isNay(nay("nope"))).is(true)
		}),

		"isYay": test(async() => {
			expect(maybe.isYay(yay(123))).is(true)
			expect(maybe.isYay(nay("nope"))).is(false)
		}),

		"nay": test(async() => {
			expect(nay("nope").yay).is(false)
			expect("value" in nay("nope")).is(false)
			expect(nay("nope").problems).ok()
			expect(nay("nope").problems.length).is(1)
			expect(nay("a", "b").problems.length).is(2)
			expect(nay().problems).ok()
			expect(nay().problems.length).is(0)
		}),

		"problems": test(async() => {
			expect(maybe.problems(yay(123))).is(undefined)
			expect(maybe.problems(nay("nope"))).ok()
			expect(maybe.problems(nay("nope"))!.length).is(1)
		}),

		"require": test(async() => {
			expect(maybe.require(yay(123))).is(123)
			expect(() => maybe.require(nay("nope"))).throws()
		}),

		"yay": test(async() => {
			expect(yay(123).yay).is(true)
			expect(yay(123).value).is(123)
			expect("problems" in yay(123)).is(false)
		}),
	},

	validators: {
		"allow": test(async() => {
			const allowBig = allow<number>("must be big", n => n > 99)
			expect(allowBig(1).yay).is(false)
			expect(allowBig(123).yay).is(true)
			expect(maybe.problems(allowBig(1))!.length).is(1)
		}),

		"allow, null problem": test(async() => {
			const allowBig = allow<number>(null, n => n > 99)
			expect(allowBig(1).yay).is(false)
			expect(allowBig(123).yay).is(true)
			expect(maybe.problems(allowBig(1))!.length).is(0)
		}),

		"deny": test(async() => {
			const denyBig = deny<number>("cannot be big", n => n > 99)
			expect(denyBig(1).yay).is(true)
			expect(denyBig(123).yay).is(false)
			expect(maybe.problems(denyBig(123))!.length).is(1)
		}),

		"deny, null problem": test(async() => {
			const denyBig = deny<number>(null, n => n > 99)
			expect(denyBig(1).yay).is(true)
			expect(denyBig(123).yay).is(false)
			expect(maybe.problems(denyBig(123))!.length).is(0)
		}),

		"all": test(async() => {
			const validator = maybe.all<number>(
				allow("must be integer", n => Number.isInteger(n)),
				deny("too big", n => n > 10),
			)
			expect(validator(5).yay).is(true)
			expect(validator(5.1).yay).is(false)
			expect(validator(15).yay).is(false)
			expect(maybe.problems(validator(15.1))!.includes("must be integer")).ok()
			expect(maybe.problems(validator(15.1))!.includes("too big")).ok()
		}),

		"all without validators passes": test(async() => {
			const validator = maybe.all<number>()
			expect(validator(5).yay).is(true)
		}),
	},
})

