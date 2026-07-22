---
id: testing-046
topic: Testing
difficulty: Senior
format: Code Review
time: 5
frequency: 40%
source: Custom
prerequisites: ["Mockito"]
tags: ['testing']
---

# Mockito InOrder

How do you verify that methods were called in a specific order using Mockito?

---ANSWER---

You use the `InOrder` class. You pass the mocks to `inOrder(mock1, mock2)`, and then call `verify` on the `InOrder` instance.

```java
InOrder inOrder = inOrder(firstMock, secondMock);
inOrder.verify(firstMock).add("was called first");
inOrder.verify(secondMock).add("was called second");
```

### Life Analogy
It's like checking the security footage to ensure the burglar entered the building *before* the alarm went off, not after.

### Key Points
- `InOrder` class.
- Verifies sequence of invocations.
