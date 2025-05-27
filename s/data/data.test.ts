
import {Science, test, expect} from "@e280/science"
import {Txt} from "./txt.js"
import {Hex} from "./hex.js"
import {Bytes} from "./bytes.js"
import {Base58} from "./base58.js"
import {Base64} from "./base64.js"
import {Base64url} from "./base64url.js"

type Util = {
	fromBytes: (bytes: Uint8Array) => string
	toBytes: (string: string) => Uint8Array
}

function testify(util: Util) {
	return test(async() => {
		const original = Bytes.random(32)
		const string = util.fromBytes(original)
		const recreated = util.toBytes(string)
		expect(Bytes.eq(original, recreated)).ok()
	})
}

export default Science.suite({
	"Base58": testify(Base58),
	"Base64": testify(Base64),
	"Base64url": testify(Base64url),
	"Hex": testify(Hex),
	"Txt": test(async() => {
		const original = `build or die. 💻>☠️ 命火工`
		const bytes = Txt.toBytes(original)
		const recreated = Txt.fromBytes(bytes)
		expect(original).is(recreated)
	}),
})

