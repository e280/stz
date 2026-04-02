
# `@e280/stz` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement



<br/>

## v0.2

### v0.2.28
- 🍏 add ok microlib, `ok`, `err`, `Result`, `need`, `grab`
- 🍏 add `thrown` helper that yoinks the error from a fn

### v0.2.27
- 🍏 update deps

### v0.2.26
- 🔶 deprecate `maybe.all`, renamed to `maybe.validator`

### v0.2.25
- 🍏 add `maybe` validation utility kit
- 🍏 update dependencies

### v0.2.24
- 🍏 make `bytes.eq` constant-time

### v0.2.23
- 🍏 `txt(bytes)` is now an alias for `txt.fromBytes(bytes)`

### v0.2.22
- 🍏 make BaseX instances (like hex, base64, etc) directly invocable via some spooky constructor magic
  - `hex(bytes) // "cd4501"`
- 🍏 hex is now case-insensitive

### v0.2.21
- 🍏 update dependencies and tweak publish workflows

### v0.2.19
- 🍏 update dependencies
- 🍏 tweak publish.yml

### v0.2.18
- 🍏 update dependencies
- 🍏 fix txt.toBytes types

### v0.2.17
- 🍏 update github actions

### v0.2.16
- 🍏 update dependencies

### v0.2.15
- 🍏 add new `all` fn (sugar for `Promise.all`)
- 🍏 document `all` and `concurrent` fns in readme
- 🍏 update dependencies

### v0.2.14
- 🍏 add new `microbounce` fn

### v0.2.13
- 🍏 improve `disposer` types

### v0.2.12
- 🍏 fix pub/sub `.next` type, accepts `fn` param

### v0.2.11
- 🍏 add `toq` file format tool
- 🔶 uncapitalize data utilities (old names deprecated)
  - `Txt` -> `txt`
  - `Bytes` -> `bytes`
  - `Bytename` -> `bytename`
  - `Thumbprint` -> `thumbprint`
  - `Hex` -> `hex`
  - `Base58` -> `base58`
  - `Base64` -> `base64`
  - `Base64url` -> `base64url`
- 🔶 rename parsed ThumbprintData
  - `thumbprint.parse(s).bytes` -> `thumbprint.parse(s).raw`
  - `thumbprint.parse(s).thumbprint` -> `thumbprint.parse(s).full`
- 🔶 rename `Time` to `time`
- 🔶 rename the whole G Crew
  - `MapG` -> `GMap`
  - `SetG` -> `GSet`
  - `WeakMapG` -> `GWeakMap`
  - `PoolG` -> `GPool`

### v0.2.10
- 🍏 update dependencies

### v0.2.9
- 🍏 add `provide` fn

### v0.2.8
- 🔶 deprecate `repeat` renamed to `cycle`
- 🔶 deprecate `loop` renamed to `count`
- 🔶 deprecate `loop2d` renamed to `count2d`
- 🍏 add `collect` fn

### v0.2.7
- 🍏 add tool `untab` for de-tabbing template strings blocks

### v0.2.6
- 🍏 add utility types `First`, `DropFirst`, `DropFirstParam`
- 🍏 add SetG clear returns this

### v0.2.5
- 🍏 improve dispenser's types

### v0.2.4
- 🍏 `disposer.schedule` returns the disposer

### v0.2.3
- 🍏 add tool `disposer`

### v0.2.2
- 🍏 add SetG `.array()` method

### v0.2.1
- 🔶 deprecate `Hat` in favor of new `Dispenser`
- 🍏 add new `Dispenser` tool, better than `Hat`

### v0.2.0
- 🟥 rename `is.set` to `is.happy`
- 🟥 rename `is.unset` to `is.sad`
- 🟥 pubsub changes
  - 🟥 change `xub`, pubsub facilities object (used to return a tuple)
  - 🍏 add new `.publish` which is a normal publisher fn without the xub facilities
  - 🍏 add new `.subscribe` which is a normal subscriber fn without the xub facilities
  - 🍏 add `fn` to `.next(fn)`
- 🍏 add new `WeakMapG` tool, like MapG but for WeakMap
- 🍏 add `range` fn



<br/>

## v0.1

### v0.1.3
- 🍏 add `pipe(x).line(fn1, fn2, fn3)`

### v0.1.2
- 🍏 export `SetG` (whoops forgot it last version lol)

### v0.1.1
- 🍏 export `obMap` and `obFilter` (slightly more performant than `ob.map` forms)
- 🍏 add `SetG` concept similar to `MapG` but for sets

### v0.1.0
- 🍏 moving to version range that allows non-breaking patches
- 🍏 update dependencies
- 🍏 add back the 'ol `Pipe.with` alias for `pipe` (why not)



<br/>

## v0.0

### v0.0.0
- 🍏 first real release

### v0.0.0-39
- 🍏 fix scope keepConstructor types
- 🍏 add new helper fn `denew`
- 🍏 add new type helper `Ctor` (perhaps replaces `Constructor`?)

### v0.0.0-38
- 🟥 rename `Scope` methods (now use add/stow/scoped/keep)

### v0.0.0-37
- 🍏 add new `Scope` tool to maybe replace `Trash`

### v0.0.0-36
- 🍏 add `Constructor<T>` type
- 🍏 add templating stuff `templateParts`, `TemplateParts`, `templateString`
- 🟥 pipe changes
  - replace `Pipe.with` with just `pipe` fn
  - rename `PipeFun` to `Piper`

### v0.0.0-35
- 🟥 change `MapG` behavior!
  - old and bad: `require` and `guarantee` used to consider `undefined` the same as the map not having the value
  - new and good: now `undefined` is a valid value (we are checking `map.has` to check if the key is set, regardless of value)

### v0.0.0-34
- 🍏 update dependencies, and readme

### v0.0.0-33
- 🍏 add readme bit for `debounce`
- 🍏 add more data utils to readme, like Hex, Base64, etc

### v0.0.0-32
- 🍏 fix readme examples and emojis

### v0.0.0-31
- 🟥 `deadline` removed `message` argument  
  old bad:
  ```ts
  deadline(ms, message, fn)
  ```
  new good:
  ```ts
  deadline(ms, fn)
  ```
  if you really need to customize message:
  ```ts
  deadline(ms, fn).catch(err => {
    if (err instanceof DeadlineError)
      err.message = "my custom deadline error message"
    throw err
  })
  ```

### v0.0.0-30
- 🍏 add `queue` fn

### v0.0.0-29
- 🟥 rename `sub().once()` to `sub().next()`
- 🟥 replace `repeatly` with simpler `repeat` fn
  - recommended to use `nap` inside the repeat fn
- 🍏 add `once` tool
- 🍏 add `ev` tool

### v0.0.0-28
- 🍏 add Time util
- 🍏 add repeatly
- 🍏 fix base64 negative integers

### v0.0.0-21
- 🍏 add `BaseX` utility with arbitrary lexicon
  - can replace Hex, Base64, Base64, etc
  - has many lexicons available in `BaseX.lexicons`
  - use it like `const base62 = new BaseX(BaseX.lexicons.base62)`
- 🟥 mass renames in data utils
  - `Hex.string` renamed to `Hex.fromBytes`
  - `Hex.bytes` renamed to `Hex.toBytes`
  - equivalent renames in `Txt`, `Base58`, `Base64`, `Base64url`

### v0.0.0-19
- 🟥 rename `deferPromise` to `defer`
  - and thus `DeferredPromise` to `Deferred`
- 🟥 renames for `is`
  - `is.available` -> `is.set`
  - `is.unavailable` -> `is.unset`
- 🟥 deleted deprecated Bytename fns (string/bytes/hex)
  - use `fromBytes` etc, you'll figure it out

### v0.0.0-18
- 🟥 rework `Thumbprint` AGAIN (i'm going insane)
  - changed names of options that nobody will use
  - `preview` is the bytename part of default 8 bytes
  - `sigil` is the bytename part of default 4 bytes

### v0.0.0-17
- 🟥 adjust `Thumbprint` to use 6-byte sigils by default, hah

### v0.0.0-16
- 🟥 adjust `Thumbprint` to use 8-byte sigils by default

### v0.0.0-15
- 🔶 Bytename deprecations
  - `.string` renamed to `.fromBytes`
  - `.bytes` renamed to `.toBytes`
  - `.hex` renamed to `.fromHex`

### v0.0.0-14
- 🟥 replace `Thumbprint.hexsigil` with `Thumbprint.sigil.fromHex`

### v0.0.0-13
- 🟥 rework `Thumbprint` fn names, expose more functionality

### v0.0.0-12
- 🟥 rename `Badge` to `Thumbprint`, rename the options

### v0.0.0-6
- 🟥 totally rework Bytename and Badge
  - bytename now defaults to wordSeparator "."

### v0.0.0-0
- 🍏 first release

