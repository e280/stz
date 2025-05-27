
import {Science, test, expect} from "@e280/science"
import {ob} from "../ob.js"
import {Txt} from "./txt.js"
import {Hex} from "./hex.js"
import {Bytes} from "./bytes.js"
import {BaseX} from "./base-x.js"
import {Base58} from "./base58.js"
import {Base64} from "./base64.js"
import {Base64url} from "./base64url.js"

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
		const original = Bytes.random(32)
		const string = util.fromBytes(original)
		const recreated = util.toBytes(string)
		expect(Bytes.eq(original, recreated)).ok()
	}
}

function testNumbers(util: NumberUtil) {
	return async() => {
		const original = 123456789
		const string = util.fromInteger(original)
		const recreated = util.toInteger(string)
		expect(original).is(recreated)
		expect(util.toInteger("")).is(0)
	}
}

function testBoth(util: ByteUtil & NumberUtil) {
	return {
		bytes: testBytes(util),
		numbers: testNumbers(util),
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
		...ob(BaseX.lexicons).map(lex => testBoth(new BaseX(lex))),
	}),
})

