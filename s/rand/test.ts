
import {suite, expect, test} from "@e280/science"
import {Rand} from "./rand.js"
import {count} from "../count.js"
import {mulberry} from "./mulberry.js"

export default suite({
	rand: {
		"coin toss challenge": test(async() => {
			const seed = 1234
			const x = 10_000
			const rand = new Rand(mulberry(seed))
			let sum = 0
			for (const _ of count(x))
				sum += rand.roll() ? 1 : -1
			const average = sum / x
			expect(Math.abs(average)).lt(0.03)
		}),

		"coin toss challenge, seedwise": test(async() => {
			const x = 10_000
			let sum = 0
			for (const i of count(x)) {
				const rand = new Rand(mulberry(i))
				sum += rand.roll() ? 1 : -1
			}
			const average = sum / x
			expect(Math.abs(average)).lt(0.03)
		}),

		"one percent": test(async() => {
			const seed = 1234
			const x = 10_000
			const rand = new Rand(mulberry(seed))
			let qualified = 0
			for (const _ of count(x))
				if (rand.roll(0.01))
					qualified += 1
			expect(qualified).gte(70)
			expect(qualified).lte(130)
		}),
	},

	mulberry: {
		"makes a lot of unique numbers": test(async() => {
			const set = new Set<number>()
			const x = 100
			const y = 100
			for (const a of count(x)) {
				const random = mulberry(a)
				for (const _ of count(y))
					set.add(random())
			}
			expect(set.size).is(x * y)
		}),

		"can be salted": test(async() => {
			const set = new Set<number>()
			const random1 = mulberry(123)
			const random2 = mulberry(123, "bingus")
			const x = 10
			for (const _ of count(x)) set.add(random1())
			for (const _ of count(x)) set.add(random2())
			expect(set.size).is(x * 2)
		}),

		"is deterministic": test(async() => {
			const a = mulberry(123, "bingus")
			const b = mulberry(123, "bingus")
			for (const _ of count(100))
				expect(a()).is(b())
		}),

		"produces fractions in [0, 1)": test(async() => {
			const random = mulberry(123)
			for (const _ of count(1_000)) {
				const n = random()
				expect(n >= 0).is(true)
				expect(n < 1).is(true)
			}
		}),
	},
})

