
# `@e280/stz` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

<br/>

## v0.0

### v0.0.0-19
- 🟥 rename `deferPromise` to `defer`
  - and thus `DeferredPromise` to `Deferred`
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

