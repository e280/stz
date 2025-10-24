
import {nap} from "../nap.js"
import {Science, expect} from "@e280/science"
import {debounceMicrotask} from "./microtask.js"

export default Science.suite({
	"reduces many calls into one": Science.test(async() => {
		let count = 0
		const increment = debounceMicrotask(() => { count += 1 })
		increment()
		increment()
		increment()
		await nap(10)
		expect(count).is(1)
	}),

	"uses last args": Science.test(async() => {
		let count = 0
		const add = debounceMicrotask((n: number) => { count += n })
		add(1)
		add(2)
		add(3)
		await nap(10)
		expect(count).is(3)
	}),

	"last return is promised": Science.test(async() => {
		let count = 0
		const hit = debounceMicrotask((n: number) => {
			count++
			return n
		})
		hit(101)
		hit(102)
		const last = await hit(103)
		expect(count).is(1)
		expect(last).is(103)
	}),

	"last return type for async looks good": Science.test(async() => {
		let count = 0
		const hit = debounceMicrotask(async(n: number) => {
			count++
			return n
		})
		hit(101)
		hit(102)
		const last = await hit(103)
		expect(count).is(1)
		expect(last).is(103)
	}),
})

