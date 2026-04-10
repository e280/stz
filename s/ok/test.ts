
import {expect, suite, test} from "@e280/science"
import {thrown} from "../thrown.js"
import {ok, err, grab, need, attempt} from "./index.js"

export default suite({
	"ok": test(async() => {
		expect(ok(123).ok).is(true)
		expect(ok(123).value).is(123)
		expect("error" in ok(123)).is(false)
	}),

	"err": test(async() => {
		expect(err("nope").ok).is(false)
		expect(err("nope").error).is("nope")
		expect("value" in err("nope")).is(false)
	}),

	"grab": test(async() => {
		expect(grab(ok(123))).is(123)
		expect(grab(err("nope"))).is(undefined)
	}),

	"need": test(async() => {
		expect(need(ok(123))).is(123)
		expect(() => need(err("nope"))).throws()
	}),

	"attempt": test(async() => {
		expect(need(await attempt(async() => 123))).is(123)
		expect((await attempt(async() => {throw new Error("rofl")})).ok).is(false)
	}),

	"need error handling": {
		"rethrows errors": test(async() => {
			const error = new TypeError()
			expect(() => need(err(error))).throws(TypeError)
			expect(thrown(() => need(err(error)))).is(error)
		}),

		"upgrades strings to errors": test(async() => {
			expect(() => need(err("nope"))).throws(Error)
			expect(thrown(() => need(err("nope"))).message).is("nope")
		}),

		"everything else is unknown": test(async() => {
			expect(() => need(err({code: 234}))).throws(Error)
			expect(thrown(() => need(err({code: 234}))).message).is("unknown")
		}),
	},
})

