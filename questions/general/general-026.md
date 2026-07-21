---
id: general-026
topic: General
difficulty: Middle
format: Open Answer
time: 8
frequency: 90%
source: Custom
prerequisites: ["Core Java", "Object class", "Collections"]
---

# equals() and hashCode() Contract

Explain the contract between `equals()` and `hashCode()` methods in Java. What happens if you override `equals()` but do not override `hashCode()`?

---ANSWER---

The contract between `equals()` and `hashCode()` in the `Object` class is crucial for the correct functioning of hash-based collections like `HashMap`, `HashSet`, and `Hashtable`.

The contract states:
1. **Consistency:** If two objects are equal according to the `equals(Object)` method, then calling the `hashCode()` method on each of the two objects must produce the same integer result.
2. **Internal Consistency:** Whenever `hashCode()` is invoked on the same object more than once during an execution, it must consistently return the same integer, provided no information used in `equals` comparisons is modified.
3. **Unequal Objects:** If two objects are unequal according to `equals(Object)`, it is *not* required that their hash codes be different. However, producing distinct integer results for unequal objects improves the performance of hash tables by reducing collisions.

**What happens if you violate the contract (override `equals` but not `hashCode`)?**

If you override `equals()` to state that two different instances are logically equal, but you inherit the default `hashCode()` from `Object` (which typically returns a distinct integer for distinct objects based on memory address), the contract is broken.

If you put such an object into a `HashMap` or `HashSet`, you might not be able to retrieve it or verify its presence. The collection uses the hash code to find the correct bucket. If two logically equal objects have different hash codes, the collection will look in the wrong bucket and fail to find the object, even though `equals()` would return true.

### Life Analogy
Think of a large library. The `hashCode` is the section/shelf number (e.g., "Fiction - A"), and `equals` is reading the book's title and author to verify it's the exact book you want. If two identical copies of "The Great Gatsby" are assigned completely different shelf numbers (broken contract), you might go to the first shelf, not find the second copy, and incorrectly conclude the library doesn't have it, even though they are identical books.

### Key Points
- Equal objects **must** have equal hash codes.
- Unequal objects *can* have the same hash code (a collision), but it's better if they don't.
- Always override `hashCode()` when you override `equals()`.
- Failing to do so breaks hash-based collections (`HashMap`, `HashSet`).
