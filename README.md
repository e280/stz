
# 🏂 `@e280/stz`
> *my typescript everyday carry*

environment-agnostic zero-dependency tools and utilities. by https://e280.org/

🍴 [**utensils**](#utensils)  
⏳ [**async/fns**](#async)  
📣 [**subby**](#subby)  
🧹 [**housekeeping**](#housekeeping)  
🎲 [**rand**](#rand)  
✅ [**ok, err, result**](#ok)  
🧬 [**hex and more**](#hex)  



<br/>

```sh
npm install @e280/stz
```

```ts
import {got, subby, Rand, hex} from "@e280/stz"
```



<br/><a id="utensils"></a>

## 🍴 utensils

- **got** — throw an error if the value is null or undefined.
    ```ts
    const value = got(nullableValue)
    ```
- **need** — return a Map value, or throw an error if missing.
    ```ts
    const value = need(map, "my_key")
    ```
- **guarantee** — get-or-create a Map value.
    ```ts
    const value = guarantee(map, "my_key", () => 123)
    ```
- **setEntries** — set many Map entries at once.
    ```ts
    setEntries(map, [["my_key1", 123], ["my_key2", 234]])
    ```
- **count** — iterate numbers
    ```ts
    for (const i of count(4))
      console.log(i)
    ```
- **grid** — iterate columns and rows
    ```ts
    for (const [x, y] of grid(2, 4))
      console.log(i)
    ```
- **arraylimit** — limit array length by dropping oldest.
    ```ts
    const trimmed = arraylimit(["a", "b", "c", "d"], 2)
      // ["c", "d"]
      // returns new array if trimming happens,
      // otherwise returns the same array unchanged.
    ```
- **pipe** — run data through several fns.
    ```ts
    const result = pipe(rawData)
      .to(parse)
      .to(validate)
      .to(normalize)
      .done()
    ```
- **obmap** — map over object entries.
    ```ts
    const alpha = {alpha: 1, bravo: 2, charlie: 3}
    ```
    ```ts
    obmap(alpha, n => n * 10)
      // {alpha: 10, bravo: 20, charlie: 30}
    ```
- **obfilter** — filter object entries.
    ```ts
    obfilter(alpha, n => n > 1)
      // {bravo: 20, charlie: 30}
    ```
- **deepFreeze** — recursively Object.freeze an object tree.
    ```ts
    const freezie = deepFreeze({alpha: 123})

    freezie.alpha = 5 // throws error
    ```
- **deepEqual** — check if two object trees have the same primitive values.
    ```ts
    deepEqual({alpha: 123}, {alpha: 123})
      // true
    ```
- **is** — check the identity of things with proper type guards.
    ```ts
    isHappy(0) // true if not null nor undefined.
    isSad(undefined) // true if null nor undefined.
    isBoolean(true) // true
    isNumber(123) // true
    isString("hello") // true
    isBigint(123n) // true
    isArray([]) // true
    isObject({}) // true
    isFn(() => {}) // true
    isSymbol(Symbol()) // true
    ```
- **time** — convert time to milliseconds
    ```ts
    seconds(1) // 1000
    minutes(2)
    hours(2)
    days(2)
    ```
    ```ts
    futureSeconds(1)
    futureMinutes(2)
    futureHours(2)
    futureDays(2)
    ```
    ```ts
    pastSeconds(1)
    pastMinutes(2)
    pastHours(2)
    pastDays(2)
    ```



<br/><a id="async"></a>

## ⏳ async/fns

- **nap** — return a promise that resolves later.
    ```ts
    await nap(1000) // sleep for one second.
    ```
- **cycle** — repeatedly call the fn back-to-back.
    ```ts
    const stop = cycle(async() => {
      console.log("hello!", Date.now())
      await nap(1000) // once per second.
    })
    ```
    ```ts
    stop() // cancel the cycle.
    ```
- **concurrent** — await a group of named promises.
    ```ts
    const {user, settings} = await concurrent({
      user: myFetchUser(),
      settings: myFetchSettings(),
    })
    ```
- **defer** — a promise you can resolve/reject from outside.
    ```ts
    const ready = defer<string>()

    ready.resolve("hello")

    await ready
      // "hello"
    ```
    ```ts
    ready.reject(new Error("rejected"))
    ```
- **collect** — async iterable to array.
    ```ts
    const entries = await collect(kv.entries())
    ```
- **once** — only execute the fn one time.
    ```ts
    const init = once(() => connect())
    init()
    init() // doesn't initialize twice.
    ```
- **queue** — make async fn calls work one-at-a-time.
    ```ts
    const save = queue(async(myData: string) => myWriteData(myData))

    await Promise.all([save("a"), save("b"), save("c")])
      // actually executes sequentially.
    ```
- **deadline** — add an expiry timeout.
    ```ts
    const connection = await deadline(10_000, connect)
      // throw DeadlineError after 10s unless connect resolves.
      // connect can be a promise or an async fn.
    ```
- **debounce** — dedupe calls over timeframe.
    ```ts
    const search = debounce(250, async(s: string) => query(s))

    search("l")
    search("lo")
    await search("lol") // last one actually runs.
    ```
- **microbounce** — dedupe calls in this microtask.
    ```ts
    let count = 0
    const run = microbounce(() => count++)

    const done = run()
    run()
    run()

    await done
    count // 1
    ```



<br/><a id="subby"></a>

## 📣 subby

- **subby** — create a subscriber fn.
    ```ts
    const on = subby<[number]>()
    ```
    ```ts
    const off = on(x => console.log(x))
    ```
    ```ts
    on.publish(123)
      // 123
    ```
    ```ts
    off() // stop listening.
    ```
- **pubby** — create a publisher fn.
    ```ts
    const publish = pubby<[number]>()
    ```
    ```ts
    const off = publish.on(x => console.log(x))
    ```
    ```ts
    publish(123)
      // 123
    ```
    ```ts
    off() // stop listening.
    ```
- 🧙‍♂️ 'on' and 'publish' both have these goodies.
    ```ts
    await on.next() // wait for the next publish.
      // 123
    ```
    ```ts
    on.set.size // direct access to the set of listeners.
    ```
    ```ts
    // limited 'on' and 'publish' fns without whole toolkit.
    const {on, publish} = subby()
    ```



<br/><a id="housekeeping"></a>

## 🧹 housekeeping

- **ev** — event listeners
    ```ts
    import {ev} from "@e280/stz"

    const off = ev(window, {
	    keydown: event => console.log(event),
	    keyup: event => console.log(event),
    })

    off() // removes both listeners
    ```
- **disposer** — garbage collector
    ```ts
    const dispose = disposer()

    dispose.schedule(() => console.log("dispose 1"))
    dispose.schedule(() => console.log("dispose 2"))
    dispose.schedule(cycle(myGameloop))
    dispose.schedule(ev(window, {keydown: myKeydown}))

    dispose() // dispose everything backwards
      // *dispose ev*
      // *dispose cycle*
      // "dispose 2"
      // "dispose 1"
    ```
    - more disposer tricks
        ```ts
        const myThing = dispose.own(new MyThing(), t => t.dispose())
          // create a thing and schedule its dispose
        ```
        ```ts
        const myThing = dispose.disposable(new MyThing())
          // return and schedule a Disposable thing
        ```
        ```ts
        const {dispose, schedule, own, disposable} = disposer()

        schedule(cycle(myGameloop))
        const myThing = disposable(new MyThing)

        dispose()
        ```



<br/><a id="rand"></a>

## 🎲 rand

- **Rand** — random utility
    ```ts
    const rand = new Rand(Math.random)
    ```
    ```ts
    const rand = new Rand(mulberry(123))
      // seeded pseudo-random number generator
    ```
    ```ts
    rand.u32() // get a random unsigned 32-bit integer.
      // 3286174905

    rand.roll(0.25) // 25% chance of true.
      // false

    rand.range(10, 20) // random float between two numbers.
      // 14.8591238

    rand.integerRange(1, 6) // inclusive integer range.
      // 4

    rand.index(7) // given array length, pick an array index.
      // 5

    rand.pick(["a", "b", "c"]) // pick your poison.
      // "c"

    rand.select(2, ["a", "b", "c"]) // pick multiple.
      // ["a", "c"]

    rand.yoink(["a", "b", "c"]) // remove and return one array element.
      // "a"

    rand.extract(2, ["a", "b", "c"]) // yoink multiple.
      // ["b", "c"]

    rand.shuffle(["a", "b", "c"]) // random-sort array in-place.
      // ["c", "a", "b"]
    ```
- **mulberry** — seeded pseudo-random number generator.
    ```ts
    const random = mulberry(123)

    random()
      // 0.7872516233474016

    random()
      // 0.1785435655619949
    ```
- **rand32** — crypto-random unsigned 32-bit integer.
    ```ts
    rand32()
      // 3948271056
    ```
- **hash32** — mix entropy into a 32-bit integer.
    ```ts
    hash32(123, "hello", 234, "world")
      // 1012994381
    ```



<br/><a id="ok"></a>

### ✅ ok, err, result
- **ok** — `Ok<Value>` — indicate success.
    ```ts
    ok(123)
      // {ok: true, value: 123}
    ```
- **err** — `Err<E>` — indicate failure.
    ```ts
    err("fail")
      // {ok: false, error: "fail"}
    ```
- `Result<Value, E>` — indicate something might succeed or fail.
    ```ts
    let result: Result<number, "fail"> = ok(123)

    result = err("fail")
    ```
- **getOk/getErr** — get the value, or `undefined`
    ```ts
    getOk(ok(123)) // 123
    getOk(err("fail")) // undefined

    getErr(ok(123)) // undefined
    getErr(err("fail")) // "fail"
    ```
- **gotOk/gotErr** — get the value, or throw
    ```ts
    gotOk(ok(123)) // 123
    gotOk(err("fail")) // throws Error("fail")

    gotErr(ok(123)) // throws error
    gotErr(err("fail")) // "fail"
    ```



<br/><a id="hex"></a>

### 🧬 hex and more
- **hex** — encode/decode hexidecimal data.
    ```ts
    hex(bytes) // encode Uint8Array bytes to string.
    hex.toBytes(string) // decode string to bytes.
    hex.toInteger(string) // decode string as integer.
    hex.fromInteger(n) // encode integer as a string.
    hex.random(32) // generate random encoded string, 32 bytes.
    ```
    ```ts
    // we have more than just hex.
    hex(bytes) // string
    base2(bytes) // string
    base36(bytes) // string
    base58(bytes) // string
    base62(bytes) // string
    base64(bytes) // string
    base64url(bytes) // string
    ```
- **txt** — text data.
    ```ts
    txt(bytes) // convert utf8 bytes to string
    txt.toBytes("hello") // convert utf8 bytes to string
    ```
- **bytes** — uint8array utilities.
    ```ts
    bytes.eq(bytesA, bytesB) // true if they're equal.
    bytes.random(32) // get 32 crypto-random bytes.
    ```



<br/><br/>

*https://e280.org/*

