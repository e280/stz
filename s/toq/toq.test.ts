
import {expect, Science, test} from "@e280/science"
import {toq} from "./index.js"
import {Txt} from "../data/txt.js"
import {deep} from "../deep/deep.js"

export default Science.suite({
	"roundtrip one file": test(async() => {
		const a: toq.Entry[] = [["hello.txt", Txt.toBytes("hello world")]]
		const b = [...toq.unpack(toq.pack(a))]
		expect(deep.equal(a, b)).ok()
	}),

	"roundtrip two files": test(async() => {
		const a: toq.Entry[] = [
			["hello.txt", Txt.toBytes("hello world")],
			["data.binary", new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])],
		]
		const b = [...toq.unpack(toq.pack(a))]
		expect(deep.equal(a, b)).ok()
	}),

	"wrong magic bytes cause failure": test(async() => {
		const good = toq.pack([["hello.txt", Txt.toBytes("hello world")]])
		const bad = new Uint8Array([...good])
		bad.set([0xDE, 0xAD, 0xBE, 0xEF], 0)
		expect(toq.is(good)).is(true)
		expect(toq.is(bad)).is(false)
		expect(() => [...toq.unpack(bad)]).throws()
	}),

	"from map": test(async() => {
		const files = new Map<string, Uint8Array>()
		files.set("hello.txt", Txt.toBytes("hello world"))
		files.set("deadbeef.data", new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]))
		const archive = toq.pack(files)
		expect(toq.is(archive)).ok()
	}),

	"to map": test(async() => {
		const archive = toq.pack([["hello.txt", Txt.toBytes("hello world")]])
		const files = new Map(toq.unpack(archive))
		expect(files.has("hello.txt")).ok()
	}),
})

