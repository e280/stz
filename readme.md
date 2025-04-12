
# `@e280/stz`
standard library of environment-agnostic typescript functions we use basically everywhere.

<br/>

## the tools
stz has many more tools than documented below, see their [sourcecode here in s/](./s/)

### MapG
- it's an extension of js Map, with two really handy new methods
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

### `pub` and `sub`
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

## 💖 made with open source love
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

