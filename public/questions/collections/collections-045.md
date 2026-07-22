---
id: collections-045
topic: Collections
difficulty: Senior
format: Code Review
time: 10
frequency: 95%
source: Custom
prerequisites: ["Object Methods", "Hashing"]
tags: ['collections']
---

# hashCode() and equals() Contract
What is the contract between `hashCode()` and `equals()`? Why must you override both if you override one?

---ANSWER---

The `hashCode()` and `equals()` methods defined in the `Object` class are deeply intertwined, particularly when objects are used as keys in hash-based collections like `HashMap` or `HashSet`.

**The Contract:**
1. If two objects are equal according to the `equals(Object)` method, then calling the `hashCode()` method on each of the two objects **must produce the same integer result**.
2. If two objects are unequal according to the `equals(Object)` method, they do *not* have to produce distinct integer results (though it is highly recommended to avoid collisions).
3. The `hashCode` must consistently return the same integer across multiple invocations, provided no information used in `equals` comparisons is modified.

**Why override both?**
If you override `equals()` to define logical equality (e.g., two Employee objects are equal if they have the same ID) but fail to override `hashCode()`, the default `Object.hashCode()` will return different memory-based integers for two logically equal objects. 

If you put one Employee in a `HashSet`, and then check if the set `contains()` a newly instantiated Employee with the exact same ID, the `HashSet` will look in the wrong bucket (because the hash codes differ) and incorrectly return `false`. The collection is essentially broken.

### Life Analogy
`hashCode()` is finding the right zip code. `equals()` is finding the exact house in that zip code. If two letters are going to the exact same house (`equals`), they absolutely must have the exact same zip code (`hashCode`). If they have different zip codes, the mailman will go to the wrong city entirely and never find the house.

### Key Points
- Equal objects MUST have equal hash codes.
- Unequal objects can have equal hash codes (collisions).
- Failing to override both breaks hash-based collections (`HashMap`, `HashSet`).
