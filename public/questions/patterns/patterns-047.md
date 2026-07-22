---
id: patterns-047
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Clean Code", "Anti-patterns"]
tags: ['patterns']
---

# Anti-pattern: Primitive Obsession
What is the Primitive Obsession anti-pattern? Give an example and explain how to fix it.

---ANSWER---

Primitive Obsession is an anti-pattern where a developer relies heavily on primitive data types (like `int`, `String`, `boolean`) to represent domain concepts, instead of creating small, dedicated objects or value types.

**Example:**
Using a `String` to represent a Zip Code or a Phone Number. Using an `int` to represent Money (in cents).

**Why it's bad:**
Primitives don't have business rules. A `String` can hold "12345" or "Hello World". If you pass a `String zipCode` to a method, you have to validate it inside the method. If you pass it to 10 methods, you duplicate validation 10 times, or risk errors.

**How to fix:**
Wrap the primitive in a small, immutable domain object (e.g., a `ZipCode` class, a `Money` class, or an `EmailAddress` class). The constructor of this class performs the validation. Now, if a method accepts an `EmailAddress` object, it *knows* the data is valid. 

### Life Analogy
Keeping all your money as a loose pile of coins in a bucket (primitives). It's money, but you have to count it every time you use it. Putting the coins into standardized paper rolls (domain objects) ensures you know exactly what you have at a glance.

### Key Points
- Using primitives for domain concepts.
- Leads to duplicated validation logic.
- Fix by extracting Value Objects.
