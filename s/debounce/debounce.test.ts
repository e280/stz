
import {nap} from "../nap.js"
import {Science, expect} from "@e280/science"
import {debounce as debounce} from "./debounce.js"

export default Science.suite({
	async "reduces many calls into one"() {
		let count = 0
		const increment = debounce(100, () => {
			count += 1
		})
		increment()
		increment()
		increment()
		await nap(200)
		expect(count).is(1)
	},
	async "timer gets reset on each call"() {
		let count = 0
		const increment = debounce(100, () => {
			count += 1
		})
		increment()
		await nap(50)
		increment()
		await nap(50)
		increment()
		await nap(50)
		increment()
		await nap(50)
		increment()
		expect(count).is(0)
		await nap(101)
		expect(count).is(1)
	},
	async "provides a promise that resolves when done"() {
		let count = 0
		const increment = debounce(100, () => {
			count += 1
		})
		let done = false
		increment()
			.then(() => done = true)
		await nap(50)
		increment()
		await nap(50)
		increment()
		await nap(50)
		increment()
		await nap(50)
		increment()
		expect(done).is(false)
		await nap(201)
		expect(done).is(true)
	},
	async "can wait multiple rounds"() {
		let count = 0
		const increment = debounce(100, () => {
			count += 1
		})
		await increment()
		expect(count).is(1)
		await increment()
		expect(count).is(2)
	},
	async "errors are passed into promise chain"() {
		const err = debounce(1, () => {
			throw new Error()
		})
		await expect(async() => err()).throwsAsync()
	},
})

