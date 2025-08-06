
# `@e280/stz` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

<br/>

## v0.0

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

