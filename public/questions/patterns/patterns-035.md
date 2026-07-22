---
id: patterns-035
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 30%
source: Custom
prerequisites: ["OOP", "Anti-patterns"]
tags: ['patterns']
---

# Anti-pattern: Poltergeist
What is the Poltergeist anti-pattern in object-oriented design?

---ANSWER---

A Poltergeist is a class that exists solely to pass information to another class or to invoke methods in another class, without adding any real business value or state of its own. Its lifespan is typically very short.

They are often recognized by names ending in `Manager`, `Controller`, `Invoker`, or `Wrapper` when those classes have almost no logic. For instance, a class that takes data from a UI, puts it in an object, and immediately passes it to a database service, then gets garbage collected.

**Why they are bad:**
They clutter the architecture, add unnecessary layers of abstraction, and make the codebase harder to navigate without providing any benefits.

**How to resolve:**
Remove the Poltergeist class and let the invoking class interact directly with the target class, or move the logic into the class that actually owns the data.

### Life Analogy
A middleman in a transaction who takes a document from Person A, walks across the room, hands it to Person B, and leaves, taking a cut of the money. Person A could have just walked across the room themselves.

### Key Points
- Short-lived classes with no real responsibility.
- Often just pass-throughs for other classes.
- Clutters the architecture.
