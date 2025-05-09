
# `@e280/stz`
standard library of environment-agnostic typescript functions we use basically everywhere
- zero dependencies

<br/>

## MapG
### extended js map
- `map.require`
  ```ts
  import {MapG} from "@e280/stz"

  const map = new MapG<number, string>([
    [1, "hello"],
    [2, "world"],
  ])

  // throws error if the value is undefined
  const value = map.require(1)
  ```
- `map.guarantee`
  ```ts
  // if the value is undefined, the new value "rofl" is set and returned
  const value = map.guarantee(3, () => "rofl")
  ```

<br/>

## pub and sub
### ergonomic event emitters
- make a publisher fn
  ```ts
  import {pub} from "@e280/stz"

  // create a pub fn
  const sendMessage = pub<[string]>()

  // subscribe to it
  sendMessage.sub(m => console.log(m))

  // publish to it
  sendMessage("hello")
  ```
- make a subscriber fn *(see how it's just the reverse of pub?)*
  ```ts
  import {sub} from "@e280/stz"

  // create a sub fn
  const onMessage = sub<[string]>()

  // subscribe to it
  onMessage(m => console.log(m))

  // publish to it
  onMessage.pub("hello")
  ```
- the pub and sub are the same, but have differing invoke signatures
- i seem to use `sub` more often
- both have some extra functionality
  ```ts
  // pub fns return a promise, to wait for all async subscribers
  await sendMessage("hello")
  await onMessage.pub("hello")

  // sub fns return an unsub fn
  const unsub1 = onMessage(m => console.log(m))
  unsub1() // unsubscribe that listener

  const unsub2 = sendMessage.sub(m => console.log(m))
  unsub2() // unsubscribe that listener

  // you can clear all subscribers from a pub or a sub
  sendMessage.clear()
  onMessage.clear()

  // you can subscribe to only one next call
  onMessage.once(m => console.log(m))
  sendMessage.once(m => console.log(m))
  ```

<br/>

## Bytename
### friendly string encoding for binary data

a bytename looks like `"midsen.picmyn.widrep.baclut dotreg.filtyp.nosnus.siptev"`. that's 16 bytes. each byte maps to a three-letter triplet

the bytename parser (`Bytename.toBytes`) ignores all non-alphabetic characters. thus `midsen.picmyn`, `midsenpicmyn`, and `mid@sen$pic@myn` are all equal.

```ts
import {Bytename} from "@e280/stz"
```
- ```ts
  Bytename.fromBytes(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]))
    // "ribmug.hilmun"
  ```
- ```ts
  Bytename.toBytes("ribmug.hilmun")
    // Uint8Array, 4 bytes
  ```
- ```ts
  const bytes = new Uint8Array([
    0xDE, 0xAD, 0xBE, 0xEF,
    0xDE, 0xAD, 0xBE, 0xEF,
  ])

	Bytename.fromBytes(bytes, {
		groupSize: 2, // default is 4
		groupSeparator: " ",
		wordSeparator: ".",
	})
	  // "ribmug.hilmun ribmug.hilmun"
  ```

<br/>

## 💖 stz is made with open source love
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

