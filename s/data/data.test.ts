
import {Science, test, expect} from "@e280/science"
import {ob} from "../ob.js"
import {Txt} from "./txt.js"
import {Hex} from "./hex.js"
import {Bytes} from "./bytes.js"
import {BaseX} from "./base-x.js"
import {Base58} from "./base58.js"
import {Base64} from "./base64.js"
import {Base64url} from "./base64url.js"

const sampleBytes = Hex.toBytes("9960cd633a46acfe8307d8a400e842da0d930a75fb8188e0f5da264e4b6b4e5b")

type ByteUtil = {
	toBytes: (string: string) => Uint8Array
	fromBytes: (bytes: Uint8Array) => string
}

type NumberUtil = {
	toInteger: (s: string) => number
	fromInteger: (n: number) => string
}

function testBytes(util: ByteUtil) {
	return async() => {
		const string = util.fromBytes(sampleBytes)
		const recreated = util.toBytes(string)
		expect(Bytes.eq(sampleBytes, recreated)).ok()
	}
}

function testNumbers(util: NumberUtil) {
	return {
		positive: async() => {
			const original = 123456789
			const string = util.fromInteger(original)
			const recreated = util.toInteger(string)
			expect(original).is(recreated)
			expect(util.toInteger("")).is(0)
		},
		negative: async() => {
			const original = -123456789
			const string = util.fromInteger(original)
			const recreated = util.toInteger(string)
			expect(original).is(recreated)
			expect(util.toInteger("")).is(0)
		},
	}
}

function testBoth(util: ByteUtil & NumberUtil) {
	return {
		bytes: testBytes(util),
		numbers: testNumbers(util),
	}
}

function testCompat(alpha: ByteUtil, bravo: ByteUtil) {
	return async() => {
		expect(alpha.fromBytes(sampleBytes))
			.is(bravo.fromBytes(sampleBytes))
	}
}

export default Science.suite({
	"Base58": testBytes(Base58),
	"Base64": testBytes(Base64),
	"Base64url": testBytes(Base64url),
	"Hex": testBytes(Hex),

	"Txt": test(async() => {
		const original = `build or die. 💻>☠️ 命火工`
		const bytes = Txt.toBytes(original)
		const recreated = Txt.fromBytes(bytes)
		expect(original).is(recreated)
	}),

	"BaseX": Science.suite({
		lexicons: Science.suite(
			ob(BaseX.lexicons).map(lex => testBoth(new BaseX(lex)))
		),
		compat: Science.suite({
			"Hex": testCompat(Hex, new BaseX(BaseX.lexicons.hex)),
			"Base64": testCompat(Base64, new BaseX(BaseX.lexicons.base64)),
			"Base64url": testCompat(Base64url, new BaseX(BaseX.lexicons.base64url)),
		}),
		"base64 has padding": test(async() => {
			const s = new BaseX(BaseX.lexicons.base64).fromBytes(sampleBytes)
			expect(s.endsWith("=")).ok()
		}),
		"antagonistic base64 positive integer": test(async() => {
			const base64url = new BaseX(BaseX.lexicons.base64url)
			expect(base64url.toInteger(base64url.fromInteger(62))).is(62)
			expect(base64url.toInteger(base64url.fromInteger(4030))).is(4030)
		}),
	}),
})

