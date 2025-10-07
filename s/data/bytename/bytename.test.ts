
import {bytes} from "../bytes.js"
import {bytename} from "./bytename.js"
import {Science, test, expect} from "@e280/science"

const deadbeef = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])

function good(b: Uint8Array) {
	expect(bytes.eq(b, deadbeef)).ok()
}

export default Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = bytename.fromBytes(deadbeef)
		expect(text).is("ribmug.hilmun")
		good(bytename.toBytes(text))
	}),

	"zero bytes": test(async() => {
		const text = bytename.fromBytes(new Uint8Array([]))
		expect(text).is("")
	}),

	"one byte": test(async() => {
		const text = bytename.fromBytes(new Uint8Array([0x00]))
		expect(text).is("doz")
	}),

	"groupings": test(async() => {
		const bytes = new Uint8Array([...deadbeef, ...deadbeef])
		const text = bytename.fromBytes(bytes, {
			groupSize: 2,
			groupSeparator: " ",
			wordSeparator: ".",
		})
		expect(text).is("ribmug.hilmun ribmug.hilmun")
	}),

	"wordsep": Science.suite({
		"underscore": test(async() => good(bytename.toBytes("ribmug_hilmun"))),
		"uppercase": test(async() => good(bytename.toBytes("RIBMUG_HILMUN"))),
		"dots": test(async() => good(bytename.toBytes("ribmug.hilmun"))),
		"crushed": test(async() => good(bytename.toBytes("ribmughilmun"))),
		"space": test(async() => good(bytename.toBytes("ribmug hilmun"))),
		"spaces": test(async() => good(bytename.toBytes("ribmug  hilmun"))),
		"whitespace": test(async() => good(bytename.toBytes("\n ribmug \n \t \n hilmun \n"))),
	}),
})

