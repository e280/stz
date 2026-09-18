
import {suite, expect, test} from "@e280/science"
import {defer} from "./defer.js"

export default suite({
	"basic deferred resolve test": test(async() => {
		let result = 0
		const ready = defer<number>()
		ready.then(n => result = n)
		ready.resolve(5)
		expect(result).is(0)
		await ready
		expect(result).is(5)
	}),

	"deferred rejects": test(async() => {
		const ready = defer<number>()
		ready.reject(new Error("oops"))
		await expect(async() => ready).throwsAsync()
	}),

	"deferred can be resolved with another promise": test(async() => {
		const ready = defer<number>()
		ready.resolve(Promise.resolve(5))
		expect(await ready).is(5)
	}),

	"deferred settles once": test(async() => {
		const ready = defer<number>()
		ready.resolve(1)
		ready.resolve(2)
		ready.reject(new Error())
		expect(await ready).is(1)
	}),
})

