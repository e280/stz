
import {Bytes} from "../bytes.js"
import {Barname} from "./barname.js"
import {Science, test, expect} from "@e280/science"

const deadbeef = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])

function good(bytes: Uint8Array) {
	expect(Bytes.eq(bytes, deadbeef)).ok()
}

export const barnameSuite = Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = Barname.string(deadbeef)
		expect(text).is("ribmug_hilmun")
		good(Barname.bytes(text))
	}),

	"zero bytes": test(async() => {
		const text = Barname.string(new Uint8Array([]))
		expect(text).is("")
	}),

	"one byte": test(async() => {
		const text = Barname.string(new Uint8Array([0x00]))
		expect(text).is("doz")
	}),

	"groupings": test(async() => {
		const bytes = new Uint8Array([...deadbeef, ...deadbeef])
		const text = Barname.string(bytes, {
			groupSize: 2,
			groupSeparator: " ",
			wordSeparator: ".",
		})
		expect(text).is("ribmug.hilmun ribmug.hilmun")
	}),

	"wordsep": Science.suite({
		"underscore": test(async() => good(Barname.bytes("ribmug_hilmun"))),
		"uppercase": test(async() => good(Barname.bytes("RIBMUG_HILMUN"))),
		"dots": test(async() => good(Barname.bytes("ribmug.hilmun"))),
		"crushed": test(async() => good(Barname.bytes("ribmughilmun"))),
		"space": test(async() => good(Barname.bytes("ribmug hilmun"))),
		"spaces": test(async() => good(Barname.bytes("ribmug  hilmun"))),
		"whitespace": test(async() => good(Barname.bytes("\n ribmug \n \t \n hilmun \n"))),
	}),
})

