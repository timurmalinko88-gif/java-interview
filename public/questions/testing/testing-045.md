---
id: testing-045
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Mockito", "BDD"]
tags: ['testing']
---

# BDDMockito

What is the difference between `Mockito` and `BDDMockito`?

---ANSWER---

They do the exact same thing technically, but `BDDMockito` provides aliases that fit the Behavior-Driven Development (BDD) naming convention.
Instead of `when().thenReturn()`, you use `given().willReturn()`.
Instead of `verify()`, you use `then().should()`.

### Life Analogy
It's like using British English vs American English. The meaning is the same, but it reads differently depending on your team's preference.

### Key Points
- Alias for Mockito methods.
- Fits Given/When/Then structure.
