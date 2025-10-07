
import {Science, test, expect} from "@e280/science"
import {ob} from "../ob.js"
import {txt} from "./txt.js"
import {bytes} from "./bytes.js"
import {BaseX} from "./base-x.js"
import {base58, base64, base64url, hex} from "./base-x-codecs.js"

const sampleBytes = hex.toBytes("9960cd633a46acfe8307d8a400e842da0d930a75fb8188e0f5da264e4b6b4e5b")

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
		expect(bytes.eq(sampleBytes, recreated)).ok()
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
	"Base58": testBytes(base58),
	"Base64": testBytes(base64),
	"Base64url": testBytes(base64url),
	"Hex": testBytes(hex),

	"Txt": test(async() => {
		const original = `build or die. 💻>☠️ 命火工`
		const bytes = txt.toBytes(original)
		const recreated = txt.fromBytes(bytes)
		expect(original).is(recreated)
	}),

	"BaseX": Science.suite({
		lexicons: Science.suite(
			ob(BaseX.lexicons).map(lex => testBoth(new BaseX(lex)))
		),
		compat: Science.suite({
			"Hex": testCompat(hex, new BaseX(BaseX.lexicons.hex)),
			"Base64": testCompat(base64, new BaseX(BaseX.lexicons.base64)),
			"Base64url": testCompat(base64url, new BaseX(BaseX.lexicons.base64url)),
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

