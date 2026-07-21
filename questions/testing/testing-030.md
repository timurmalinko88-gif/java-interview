---
id: testing-030
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Mockito"]
---

# Mockito thenReturn vs doReturn

What is the difference between `when().thenReturn()` and `doReturn().when()`?

---ANSWER---

Both stub a method. However, `doReturn().when()` is required when dealing with Spies, otherwise the real method will be called during the stubbing phase, which might throw an exception.

### Life Analogy
`thenReturn` is telling an actor what to say. `doReturn` is telling a real person what to say before they accidentally blurt out the truth.

### Key Points
- `doReturn` is safe for spies.
- `thenReturn` is standard for mocks.
