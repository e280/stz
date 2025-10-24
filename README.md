
# 🏂 `@e280/stz`

**stz** is e280's standard library of environment-agnostic typescript tools. zero dependencies.



<br/>

## 🥨 stz primitives

### 🍏 `pub` and `sub`
> ergonomic event emitters

```ts
import {pub, sub} from "@e280/stz"
```

#### `pub`
- make a publisher fn
  ```ts
  // create a pub fn
  const sendMessage = pub<[string]>()

  // subscribe to it
  sendMessage.subscribe(m => console.log(m))

  // publish to it
  sendMessage("hello")
  ```

#### `sub`
- make a subscriber fn — *it's just like pub, except it's flipsy-reversey!*
  ```ts
  // create a sub fn
  const onMessage = sub<[string]>()

  // subscribe to it
  onMessage(m => console.log(m))

  // publish to it
  onMessage.publish("hello")
  ```

#### pub vs sub
- pub and sub both have the same facilities
  - `.publish`
  - `.subscribe`
  - `.on`
  - `.next`
  - `.clear`
- i seem to use `sub` more often

#### the more you know, about pubsub
- publish actually returns a promise, to wait for all async subscribers
  ```ts
  await onMessage.publish("hello")
  ```
- subscribe returns a fn to unsubscribe
  ```ts
  const unsubscribe = onMessage(() => {})
  unsubscribe()
  ```
- `.clear()` to wipe all subscribed listeners
  ```ts
  onMessage.clear()
  ```
- `.next(fn?)` is a better way to do .once..  
  - you can use it like a .once:
    ```ts
    onMessage.next(message => {})
    ```
  - but it also gives you a promise like this:
    ```ts
    const [message] = await onMessage.next()
    ```
  - of course the promise can be used like this:
    ```ts
    onMessage.next().then(([message]) => {})
    ```

### 🍏 defer
> defer the resolve/reject of a promise to the outside

```ts
import {defer} from "@e280/stz"

const deferred = defer()
```

- resolve the deferred promise
    ```ts
    deferred.resolve()
    ```
- reject the deferred promise
    ```ts
    deferred.reject(new Error("fail"))
    ```
- await the promise
    ```ts
    await deferred.promise
    ```

### 🍏 nap
> sleep for some milliseconds

```ts
import {nap} from "@e280/stz"

await nap(900)
  // wait for 900 milliseconds
```

### 🍏 disposer
> easy trash management

```ts
import {disposer} from "@e280/stz"
```

- create a disposer
    ```ts
    const dispose = disposer()
    ```
- schedule something for cleanup
    ```ts
    dispose.schedule(() => console.log("disposed!"))
    ```
- schedule multiple things at once
    ```ts
    dispose.schedule(
      () => console.log("disposed thing 1"),
      () => console.log("disposed thing 2"),
      () => ev(window, {keydown: () => console.log("keydown")}),
    )
    ```
- schedule is chainable if you prefer that vibe
    ```ts
    dispose
      .schedule(() => console.log("disposed thing 1"))
      .schedule(() => console.log("disposed thing 2"))
      .schedule(() => ev(window, {keydown: () => console.log("keydown")}))
    ```
- **dispose** of all that garbage
    ```ts
    dispose()
    ```

### 🍏 G Crew
> extended js data types

#### GMap
> extended js Map
- many are saying it's *"The Deluxe Mapping Experience"*
  ```ts
  import {GMap} from "@e280/stz"

  const map = new GMap<number, string>([
    [1, "hello"],
    [2, "world"],
  ])
  ```
- `map.require(key)` — returns the value for key.. if missing, throw an error
  ```ts
  const value = map.require(1)
    // "hello"
  ```
- `map.guarantee(key, makeFn)` — returns the value for `key`.. if missing, run `makeFn` to set and return the value
  ```ts
  const value = map.guarantee(3, () => "rofl")
    // "rofl"
  ```

#### GSet
> extended js Set
- `new GSet<T>()`
- `set.adds(item1, item2, item3)` — add multiple items without a for-loop
- `set.deletes(item1, item2, item3)` — add multiple items without a for-loop

#### GWeakMap
> extended js WeakMap
- `new GWeakMap<K, V>()`
- `weakMap.require(key)` — returns value for key.. if missing, throw an error
- `weakMap.guarantee(key, makeFn)` — returns the value for key.. if missing, run `makeFn` to set and return the value



<br/>

## 🥨 stz fn tools

### 🍏 `queue(fn)`
> execute calls in sequence (not concurrent)

```ts
import {queue, nap} from "@e280/stz"

const fn = queue(async() => nap(100))

fn()
fn()
await fn() // waits for the previous calls (sequentially)
```

### 🍏 `once(fn)`
> ensure a fn is only executed one time

```ts
import {once} from "@e280/stz"

let count = 0
const fn = once(() => count++)
console.log(count) // 0

fn()
console.log(count) // 1

fn()
console.log(count) // 1
```

### 🍏 `deadline(100, fn)`
> throws an error if the async function takes too long

```ts
import {deadline} from "@e280/stz"

const fn = deadline(100, async() => {

  // example deliberately takes too long
  await nap(200)
})

await fn()
  // DeadlineError: deadline exceeded (0.1 seconds)
```

### 🍏 `debounce(100, fn)`
> wait some time before actually executing the fn (absorbing redundant calls)

we use `debounce` a lot in ui code, like on a user's keyboard input in a form field, but rendering the form input can actually be slow enough that it causes problems when they type fast — to eliminate the jank, we `debounce` with like 400 ms, so we wait for the user to finish typing for a moment before actually running the validation.

```ts
import {debounce} from "@e280/stz"

const fn = debounce(100, async() => {
  await coolAction()
})

// each fn() call resets the timer
fn()
fn()
fn()

// coolAction is only called once here, other calls are redundant
```

### 🍏 `microbounce(fn)`
> collapse multiple calls into a single call (uses queueMicrotask under the hood)

it's like `debounce(0, fn)` but more efficient by using queueMicrotask instead of setTimeout

```ts
import {microbounce} from "@e280/stz"

const fn = microbounce(async() => coolAction())
fn()
fn()
fn() // previous calls are redundant
```

### 🍏 `cycle(fn)`
> execute a function over and over again, back to back

```ts
import {cycle} from "@e280/stz"

let ticks = 0

const stop = cycle(async() => {

  // use a nap to add a delay between each execution
  await nap(200)

  ticks++
})

// stop repeating whenever you want
stop()
```



<br/>

## 🥨 stz data utilities

### 🍏 txt
> convert to/from utf8 string format
- `txt.fromBytes(bytes)` — bytes to string
- `txt.toBytes(string)` — string to bytes

### 🍏 bytes
> utilities for dealing with Uint8Array
- `bytes.eq(bytesA, bytesB)` — check if two byte arrays are equal
- `bytes.random(32)` — generate crypto-random bytes

### 🍏 BaseX utilities
> convert binary data to/from various encodings

```ts
import {hex, base58, base64} from "@e280/stz"
```

#### hex
> all BaseX utilities have these methods
- `hex.fromBytes(u8array)` — encode bytes to string
- `hex.toBytes(str)` — decode string to bytes
- `hex.toInteger(string)` — decode string as js integer
- `hex.fromInteger(n)` — encode js integer as a string
- `hex.random(32)` — generate random encoded string (32 bytes)

#### all BaseX utilities
- `hex`
- `base2`
- `base36`
- `base58`
- `base62`
- `base64`
- `base64url`

#### make a custom BaseX utility
- you can provide a `lexicon` to produce your own BaseX codec
    ```ts
    const myHex = new BaseX({characters: "0123456789abcdef"})
    ```

#### tiny timestamps
- fun fact: you can make insanely compact timestamp strings like this:
  ```ts
  base62.fromInteger(Date.now() / 1000)
    // "1uK3au"
  ```
  - `1748388028` base10 epoch seconds (10 chars)
  - `1uK3au` base62 epoch seconds (6 chars)
  - *nice*

### 🍏 bytename
> friendly string encoding for binary data

a bytename looks like `"midsen.picmyn.widrep.baclut dotreg.filtyp.nosnus.siptev"`. that's 16 bytes. each byte maps to a three-letter triplet

the bytename parser (`bytename.toBytes`) ignores all non-alphabetic characters. thus `midsen.picmyn`, `midsenpicmyn`, and `mid@sen$pic@myn` are all equal.

```ts
import {bytename} from "@e280/stz"
```
- ```ts
  bytename.fromBytes(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]))
    // "ribmug.hilmun"
  ```
- ```ts
  bytename.toBytes("ribmug.hilmun")
    // Uint8Array, 4 bytes
  ```
- ```ts
  const data = new Uint8Array([
    0xDE, 0xAD, 0xBE, 0xEF,
    0xDE, 0xAD, 0xBE, 0xEF,
  ])

  bytename.fromBytes(data, {
    groupSize: 2, // default is 4
    groupSeparator: " ",
    wordSeparator: ".",
  })
    // "ribmug.hilmun ribmug.hilmun"
  ```

### 🍏 thumbprint
> hybrid of bytename and base58 to make binary data more human-friendly
- looks like `nodlyn.fasrep.habbud.ralwel.Avo7gFmdWMRHkwsD149mcaBoZdS69iXuJ`
- the idea is that the first parts are in bytename format, so it's easy for humans to recognize
- and the remaining data is shown in base58
- `thumbprint.fromBytes(u8array)` — encode bytes to thumbprint string
- `thumbprint.toBytes(thumbstring)` — decode thumbprint string to bytes
- `thumbprint.fromHex(hexstring)` — convert a hex string into a thumbprint
- `thumbprint.toHex(thumbstring)` — convert a thumbprint into a hex string

### 🍏 toq
> tar-like binary file format for efficiently packing multiple files together

```ts
import {toq, txt} from "@e280/stz"
```

#### data layout
- 4 magic bytes `"TOQ\x01"`
- for each file (little endian)
  - `name length` 1 byte (u8)
  - `name` x bytes (max 255 B)
  - `data length` 4 bytes (u32)
  - `data` x bytes (max 4 GB)

#### toq pack/unpack
- **toq.pack** — accepts any iterable of file entries
    ```ts
    const pack: Uint8Array = toq.pack([
      ["hello.txt", txt.toBytes("hello world")],
      ["deadbeef.data", new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])],
    ])
    ```
- **toq.is** — check if a file is a toq pack or not
    ```ts
    toq.is(pack) // true
    ```
- **toq.unpack** — generator fn yields file entries
    ```ts
    for (const [name, data] of toq.unpack(pack))
      console.log(name, data.length)
    ```

#### toq works nice with maps
- **pack a map of files**
    ```ts
    const files = new Map<string, Uint8Array>()
    files.set("hello.txt", txt.toBytes("hello world"))
    files.set("deadbeef.data", new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]))

    const pack = toq.pack(files)
    ```
- **unpack into a new map**
    ```ts
    const files = new Map(toq.unpack(pack))
    ```


<br/><br/>

## 💖 stz is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

