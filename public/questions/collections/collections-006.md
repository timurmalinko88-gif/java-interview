---
id: collections-006
topic: Collections
difficulty: Middle
format: Open Answer
time: 10
frequency: 85%
source: Custom
prerequisites: ["Hashing"]
tags: [spring-core, oop, stream-api, collections]
---

# HashSet Internal Implementation
How is `HashSet` implemented internally in Java? What backs it?

---ANSWER---

`HashSet` in Java is internally backed by a `HashMap`. 

When you create a `HashSet`, it internally creates a `HashMap`. When you add a new element to the `HashSet` using `add(element)`, the `HashSet` uses this element as a **key** in the internal `HashMap`. For the value, it uses a constant dummy object `private static final Object PRESENT = new Object();`.

Since a `HashMap` only allows unique keys, this perfectly implements the set logic that prevents duplicate elements. If the `HashMap` returns `null` from its `put` method (meaning the key wasn't there before), `HashSet.add()` returns `true`. If the key was already there, `put` returns the old value (the `PRESENT` object), and `HashSet.add()` returns `false`.

### Life Analogy
Imagine a club's VIP list. The club bouncer uses a guestbook (HashMap). When you try to enter (add to Set), your name is the key. The bouncer just checks off a box (the `PRESENT` object) next to your name. If your name is already in the guestbook, you are already checked in.

### Key Points
- Backed by a `HashMap`.
- Elements of the Set become Keys in the Map.
- Values in the Map are all the same dummy object `PRESENT`.
