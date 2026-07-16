
import {expect, suite, test} from "@e280/science"
import {thrown} from "../thrown.js"
import {ok, err, getOk, gotOk, gotErr, getErr, resultify, Err, resultifyAsync} from "./index.js"

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

	"gotOk": test(async() => {
		expect(gotOk(ok(123))).is(123)
		expect(() => gotOk(err("nope"))).throws()
	}),

	"gotErr": test(async() => {
		expect(gotErr(err("nope"))).is("nope")
		expect(() => gotErr(ok(123))).throws()
	}),

	"resultify": test(async() => {
		expect(gotOk(resultify(() => 123)())).is(123)
		expect(resultify(() => {throw new Error("rofl")})().ok).is(false)
		expect(gotErr(resultify(() => {throw new Error("rofl")})() as Err<Error>).message).is("rofl")
	}),

	"resultifyAsync": test(async() => {
		expect(gotOk(await resultifyAsync(async() => 123)())).is(123)
		expect((await resultifyAsync(async() => {throw new Error("rofl")})()).ok).is(false)
		expect(gotErr(await resultifyAsync(async() => {throw new Error("rofl")})() as Err<Error>).message).is("rofl")
	}),

	"gotOk error handling": {
		"rethrows errors": test(async() => {
			const error = new TypeError()
			expect(() => gotOk(err(error))).throws(TypeError)
			expect(thrown(() => gotOk(err(error)))).is(error)
		}),

		"upgrades strings to errors": test(async() => {
			expect(() => gotOk(err("nope"))).throws(Error)
			expect(thrown(() => gotOk(err("nope"))).message).is("nope")
		}),

		"everything else is unknown": test(async() => {
			expect(() => gotOk(err({code: 234}))).throws(Error)
			expect(thrown(() => gotOk(err({code: 234}))).message).is("unknown")
		}),
	},
})

