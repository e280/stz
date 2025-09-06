
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

### 🍏 MapG
> extended js Map

- many say it's *"The Deluxe Mapping Experience"*
  ```ts
  import {MapG} from "@e280/stz"

  const map = new MapG<number, string>([
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

### 🍏 SetG
> extended js Set
- `new SetG<T>()`
- `set.adds(item1, item2, item3)` — add multiple items without a for-loop
- `set.deletes(item1, item2, item3)` — add multiple items without a for-loop

### 🍏 WeakMapG
> extended js WeakMap
- `new WeakMapG<K, V>()`
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

### 🍏 `repeat(fn)`
> execute a function over and over again, back to back

```ts
import {repeat} from "@e280/stz"

let ticks = 0

const stop = repeat(async() => {

  // use a nap to add a delay between each execution
  await nap(200)

  ticks++
})

// stop repeating whenever you want
stop()
```



<br/>

## 🥨 stz data utilities

### 🍏 Hex
> convert to/from hexadecimal string format
- `Hex.fromBytes(bytes)` — bytes to hex string
- `Hex.toBytes(string)` — hex string to bytes
- `Hex.random(32)` — generate random hex string (32 bytes)

### 🍏 Base64
> convert to/from base64 string format
- `Base64.fromBytes(bytes)` — bytes to string
- `Base64.toBytes(string)` — string to bytes
- `Base64.random(32)` — generate random string (32 bytes)

### 🍏 Base64url
> convert to/from base64 string format
- `Base64url.fromBytes(bytes)` — bytes to string
- `Base64url.toBytes(string)` — string to bytes
- `Base64url.random(32)` — generate random string (32 bytes)

### 🍏 Base58
> convert to/from base64 string format
- `Base58.fromBytes(bytes)` — bytes to string
- `Base58.toBytes(string)` — string to bytes
- `Base58.random(32)` — generate random string (32 bytes)

### 🍏 Txt
> convert to/from utf8 string format
- `Txt.fromBytes(bytes)` — bytes to string
- `Txt.toBytes(string)` — string to bytes

### 🍏 Bytes
> utilities for dealing with Uint8Array
- `Bytes.eq(bytesA, bytesB)` — check if two byte arrays are equal
- `Bytes.random(32)` — generate crypto-random bytes

### 🍏 BaseX
> convert data into arbitrary data encodings
- make a BaseX instance
  ```ts
  import {BaseX} from "@e280/stz"

  const hex = new BaseX(BaseX.lexicons.hex)
  ```
- convert between strings and binary
  ```ts
  hex.toBytes("9960cd633a46acfe8307d8a400e842da0d930a75fb8188e0f5da264e4b6b4e5b")
    // Uint8Array

  hex.fromBytes(bytes)
    // string
  ```
- you can also convert between strings and integers
  ```ts
  hex.fromInteger(Date.now())
    // "197140ac804"

  hex.toInteger(hex)
    // 1748387940356
  ```
- available lexicons include
	- base2
	- hex
	- base36
	- base58
	- base62
	- base64 (with standard padding)
	- base64url
- you can make insanely compact timestamps like this:
  ```ts
  import {BaseX} from "@e280/stz"

  const base62 = new BaseX(BaseX.lexicons.base62)

  base62.fromInteger(Date.now() / 1000)
    // "1uK3au"
  ```
  - `1748388028` base10 epoch seconds (10 chars)
  - `1uK3au` base62 epoch seconds (6 chars)
  - *nice*



<br/>

### 🍏 Bytename
> friendly string encoding for binary data

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



<br/><br/>

## 💖 stz is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

