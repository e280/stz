
import {nap} from "../nap.js"
import {microbounce} from "./microbounce.js"
import {Science, expect} from "@e280/science"

export default Science.suite({
	"reduces many calls into one": Science.test(async() => {
		let count = 0
		const increment = microbounce(() => { count += 1 })
		increment()
		increment()
		increment()
		await nap(10)
		expect(count).is(1)
	}),

	"uses last args": Science.test(async() => {
		let count = 0
		const add = microbounce((n: number) => { count += n })
		add(1)
		add(2)
		add(3)
		await nap(10)
		expect(count).is(3)
	}),

	"last return is promised": Science.test(async() => {
		let count = 0
		const hit = microbounce((n: number) => {
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
		const hit = microbounce(async(n: number) => {
			count++
			return n
		})
		hit(101)
		hit(102)
		const last = await hit(103)
		expect(count).is(1)
		expect(last).is(103)
	}),

	"do it twice": Science.test(async() => {
		{
			let count = 0
			const increment = microbounce(() => { count += 1 })
			increment()
			increment()
			increment()
			await nap(10)
			expect(count).is(1)
		}
		{
			let count = 0
			const increment = microbounce(() => { count += 1 })
			increment()
			increment()
			increment()
			await nap(10)
			expect(count).is(1)
		}
	}),
})

