
import {Science, expect} from "@e280/science"

import {nap} from "../nap.js"
import {queue} from "./queue.js"

export default Science.suite({
	"job runs": Science.test(async() => {
		let concurrent = 0
		const job = queue(async() => {
			concurrent++
			await nap(100)
			concurrent--
		})
		const promise1 = job()
		await nap(50)
		expect(concurrent).is(1)
		await promise1
		expect(concurrent).is(0)
	}),

	"sequencing is enforced": Science.test(async() => {
		let concurrent = 0
		const job = queue(async() => {
			concurrent++
			await nap(100)
			concurrent--
		})

		const promise1 = job()
		const promise2 = job()

		await nap(50)
		expect(concurrent).is(1)

		await promise1
		await nap(50)
		expect(concurrent).is(1)

		await promise2
		expect(concurrent).is(0)
	}),

	"params and return values seem to work": Science.test(async() => {
		const add = queue(async(a: number, b: number) => {
			await nap(100)
			return a + b
		})
		const promise1 = add(1, 2)
		const promise2 = add(10, 20)
		expect(await promise1).is(3)
		expect(await promise2).is(30)
	}),

	"first job throws, second job unaffected": Science.test(async() => {
		let run = 0
		const job = queue(async() => {
			run++
			await nap(100)
			if (run === 1)
				throw new Error("first job failed")
		})
		expect(async() => job()).throwsAsync()
		expect(async() => job()).not.throwsAsync()
	}),
})

