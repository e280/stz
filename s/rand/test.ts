
import {suite, expect, test} from "@e280/science"
import {Rand} from "./rand.js"
import {count} from "../count.js"
import {array} from "../array.js"
import {hash32, mulberry} from "./mulberry.js"

export default suite({
	rand: {
		"snapshot": test(async() => {
			const seed = 1234
			const rand = new Rand(mulberry(seed))
			const snapshot = array(10, () => rand.u32())
			expect(snapshot).deep([
				314799534, 3021131492,
				3877737075, 4168477787,
				175938938, 505788695,
				694861204, 3447815142,
				1713389954, 547570102,
			])
		}),

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

	hash32: {
		"is deterministic": test(async() => {
			expect(hash32("hello")).is(hash32("hello"))
		}),

		"can do a numbers and strings": test(async() => {
			expect(hash32(123)).is(2905384493)
			expect(hash32("hello")).is(1686101545)
		}),

		"boundary-aware": test(async() => {
			expect(hash32("hello", "world"))
				.not.is(hash32("helloworld"))
		}),

		"order matters": test(async() => {
			expect(hash32("hello", "world"))
				.not.is(hash32("world", "hello"))
		}),

		"numbers and strings are distinct": test(async() => {
			expect(hash32(123))
				.not.is(hash32("123"))
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

