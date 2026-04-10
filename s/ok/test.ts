
import {expect, suite, test} from "@e280/science"
import {thrown} from "../thrown.js"
import {ok, err, getOk, needOk, attempt, needErr, getErr, attemptAsync} from "./index.js"

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

	"getOk": test(async() => {
		expect(getOk(ok(123))).is(123)
		expect(getOk(err("nope"))).is(undefined)
	}),

	"getErr": test(async() => {
		expect(getErr(err("nope"))).is("nope")
		expect(getErr(ok(123))).is(undefined)
	}),

	"needOk": test(async() => {
		expect(needOk(ok(123))).is(123)
		expect(() => needOk(err("nope"))).throws()
	}),

	"needErr": test(async() => {
		expect(needErr(err("nope"))).is("nope")
		expect(() => needErr(ok(123))).throws()
	}),

	"attempt": test(async() => {
		expect(needOk(attempt(() => 123))).is(123)
		expect(attempt(() => {throw new Error("rofl")}).ok).is(false)
		expect(needErr<Error>(attempt(() => {throw new Error("rofl")})).message).is("rofl")
	}),

	"attemptAsync": test(async() => {
		expect(needOk(await attemptAsync(async() => 123))).is(123)
		expect((await attemptAsync(async() => {throw new Error("rofl")})).ok).is(false)
		expect(needErr<Error>(await attemptAsync(async() => {throw new Error("rofl")})).message).is("rofl")
	}),

	"needOk error handling": {
		"rethrows errors": test(async() => {
			const error = new TypeError()
			expect(() => needOk(err(error))).throws(TypeError)
			expect(thrown(() => needOk(err(error)))).is(error)
		}),

		"upgrades strings to errors": test(async() => {
			expect(() => needOk(err("nope"))).throws(Error)
			expect(thrown(() => needOk(err("nope"))).message).is("nope")
		}),

		"everything else is unknown": test(async() => {
			expect(() => needOk(err({code: 234}))).throws(Error)
			expect(thrown(() => needOk(err({code: 234}))).message).is("unknown")
		}),
	},
})

