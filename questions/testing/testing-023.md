---
id: testing-023
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Mockito"]
tags: [testing, spring-core]
---

# Mockito verify()

What does `verify()` do in Mockito?

---ANSWER---

`verify()` checks if a specific method on a mock was called, how many times it was called, or if it was called with specific arguments.

### Life Analogy
It's like checking the call log on your phone to verify if someone actually called you.

### Key Points
- Validates interactions with mocks.
- Can check invocation count (`times()`, `never()`).
