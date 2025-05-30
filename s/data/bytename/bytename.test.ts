
import {Bytes} from "../bytes.js"
import {Bytename} from "./bytename.js"
import {Science, test, expect} from "@e280/science"

const deadbeef = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])

function good(bytes: Uint8Array) {
	expect(Bytes.eq(bytes, deadbeef)).ok()
}

export default Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = Bytename.fromBytes(deadbeef)
		expect(text).is("ribmug.hilmun")
		good(Bytename.toBytes(text))
	}),

	"zero bytes": test(async() => {
		const text = Bytename.fromBytes(new Uint8Array([]))
		expect(text).is("")
	}),

	"one byte": test(async() => {
		const text = Bytename.fromBytes(new Uint8Array([0x00]))
		expect(text).is("doz")
	}),

	"groupings": test(async() => {
		const bytes = new Uint8Array([...deadbeef, ...deadbeef])
		const text = Bytename.fromBytes(bytes, {
			groupSize: 2,
			groupSeparator: " ",
			wordSeparator: ".",
		})
		expect(text).is("ribmug.hilmun ribmug.hilmun")
	}),

	"wordsep": Science.suite({
		"underscore": test(async() => good(Bytename.toBytes("ribmug_hilmun"))),
		"uppercase": test(async() => good(Bytename.toBytes("RIBMUG_HILMUN"))),
		"dots": test(async() => good(Bytename.toBytes("ribmug.hilmun"))),
		"crushed": test(async() => good(Bytename.toBytes("ribmughilmun"))),
		"space": test(async() => good(Bytename.toBytes("ribmug hilmun"))),
		"spaces": test(async() => good(Bytename.toBytes("ribmug  hilmun"))),
		"whitespace": test(async() => good(Bytename.toBytes("\n ribmug \n \t \n hilmun \n"))),
	}),
})

