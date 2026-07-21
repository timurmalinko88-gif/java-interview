---
id: general-037
topic: General
difficulty: Middle
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Object class", "Core Java"]
---

# equals() and hashCode() Contract
Explain the contract between `equals()` and `hashCode()` in Java. What happens if you override `equals()` but fail to override `hashCode()`?

---ANSWER---

The contract between `equals()` and `hashCode()` states that:
1. If two objects are equal according to the `equals(Object)` method, then calling the `hashCode()` method on each of the two objects must produce the same integer result.
2. If two objects are unequal according to the `equals(Object)` method, it is *not* required that they produce distinct integer results (though distinct hashes improve hash table performance).
3. The `hashCode()` method must consistently return the same integer across multiple invocations during the same execution of the application, provided no information used in `equals` comparisons is modified.

**What happens if you violate it?**
If you override `equals()` but not `hashCode()`, your class will violate this contract. If you use instances of this class as keys in hash-based collections (like `HashMap`, `HashSet`, or `Hashtable`), the collections will not function correctly. You could add two objects that are logically equal, but the collection will treat them as different entities and store both because their default `hashCode()` values (usually based on memory address) will differ.

### Life Analogy
`hashCode()` is like a zip code, and `equals()` is like a street address. If two houses have the exact same street address (meaning they are the same house), they must have the same zip code. If you update the address format (`equals`) without updating how the zip code is calculated (`hashCode`), the mail carrier (HashMap) will put the mail in the wrong delivery bucket and will never find your house when searching for it.

### Key Points
- Always override `hashCode()` when you override `equals()`.
- Equal objects must have equal hash codes.
- Unequal objects do not necessarily need unequal hash codes, but it minimizes collisions.
