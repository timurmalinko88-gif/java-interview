---
id: testing-012
topic: Testing
difficulty: Senior
format: Code Review
time: 10
frequency: 60%
source: Custom
prerequisites: ["Mockito"]
tags: [testing, oop, spring-core, system-design]
---

# Mockito ArgumentCaptor

When and how do you use `ArgumentCaptor` in Mockito?

---ANSWER---

`ArgumentCaptor` is used when you need to inspect the exact arguments passed to a mocked method, especially if those arguments are complex objects created or modified inside the method under test.

**Usage:**
1. Declare an `ArgumentCaptor`.
2. Call `verify()` on the mock and pass the captor.
3. Call `captor.getValue()` to assert the properties.

### Life Analogy
It's like a security camera at a toll booth. You don't just verify that a car passed through; you capture the license plate so you can check it later.

### Key Points
- Captures arguments passed to a mock.
- Useful for asserting on complex internal state changes.
- Used during the `verify` phase.
