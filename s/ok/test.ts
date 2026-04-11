
import {expect, suite, test} from "@e280/science"
import {thrown} from "../thrown.js"
import {ok, err, getOk, needOk, attempt, needErr, getErr, attemptAsync, resultify, Err, resultifyAsync} from "./index.js"

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

	"resultify": test(async() => {
		expect(needOk(resultify(() => 123)())).is(123)
		expect(resultify(() => {throw new Error("rofl")})().ok).is(false)
		expect(needErr(resultify(() => {throw new Error("rofl")})() as Err<Error>).message).is("rofl")
	}),

	"resultifyAsync": test(async() => {
		expect(needOk(await resultifyAsync(async() => 123)())).is(123)
		expect((await resultifyAsync(async() => {throw new Error("rofl")})()).ok).is(false)
		expect(needErr(await resultifyAsync(async() => {throw new Error("rofl")})() as Err<Error>).message).is("rofl")
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

