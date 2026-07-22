---
id: general-050
topic: General
difficulty: Middle
format: Open Answer
time: 10
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Object class", "Hashing"]
tags: [oop, spring-core, stream-api, memory, collections]
---

# equals() and hashCode() Contract
What is the contract between `equals()` and `hashCode()` in Java? What happens if you override `equals()` but fail to override `hashCode()`?

---ANSWER---

The `Object` class defines both `equals()` and `hashCode()` methods. The contract between them dictates how objects should behave when compared and stored in hash-based collections (like `HashMap`, `HashSet`, and `Hashtable`).

**The Contract:**
1.  **If two objects are equal according to the `equals(Object)` method, then calling the `hashCode` method on each of the two objects must produce the same integer result.**
2.  If two objects are unequal according to the `equals(Object)` method, it is *not* required that their hash codes be distinct (though producing distinct hash codes can improve the performance of hash tables).
3.  Whenever `hashCode()` is invoked on the same object more than once during an execution of a Java application, it must consistently return the same integer, provided no information used in `equals` comparisons on the object is modified.

**Consequences of breaking the contract (overriding equals without hashCode):**
If you override `equals()` to compare objects logically (e.g., two `Person` objects are equal if they have the same ID) but fail to override `hashCode()`, the default `Object.hashCode()` implementation will be used, which typically derives the hash code from the object's memory address.

This leads to bugs in hash-based collections:
1.  You create two logically equal objects (e.g., `p1` and `p2` both have ID=5). `p1.equals(p2)` returns `true`.
2.  You put `p1` into a `HashSet`.
3.  You check if the set contains `p2` using `set.contains(p2)`.
4.  Because `p1` and `p2` have different memory addresses, they will likely have different hash codes. The `HashSet` will look in the wrong "bucket" for `p2` and incorrectly return `false`, even though the object is logically present.

### Life Analogy
Imagine a massive library. `hashCode()` is the section number (e.g., Section 5: Sci-Fi), and `equals()` is checking the exact title and author of the book. 
If two books are identical (`equals`), they MUST be placed in the same section (`hashCode`). 
If you update your rules for identifying a book (override `equals`) but forget to update how you assign sections (fail to override `hashCode`), a librarian might look for an identical book in the wrong section entirely and incorrectly conclude it's not in the library.

### Key Points
- If `a.equals(b)` is true, `a.hashCode() == b.hashCode()` MUST be true.
- If `a.equals(b)` is false, their hash codes do not have to be different.
- Failing to override `hashCode()` when overriding `equals()` breaks hash-based collections like `HashMap` and `HashSet`.
- Always generate hash codes using the same fields that are used for the equality check.
