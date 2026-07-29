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

**Detailed Usage & Code Example:**

```java
@Test
void testSequentialExecutionOrder() {
    AuditLogger loggerMock = mock(AuditLogger.class);
    PaymentGateway paymentMock = mock(PaymentGateway.class);
    
    OrderProcessor processor = new OrderProcessor(loggerMock, paymentMock);
    processor.processPayment(new PaymentRequest(500));
    
    // Create InOrder verifier passing all participating mocks
    InOrder inOrder = inOrder(loggerMock, paymentMock);
    
    // Verify relative execution sequence
    inOrder.verify(loggerMock).logStart("Payment processing");
    inOrder.verify(paymentMock).charge(500);
    inOrder.verify(loggerMock).logSuccess("Payment complete");
}
```
`InOrder` verifies **relative** invocation ordering across the specified mock objects without requiring every intermediate un-mocked method to be explicitly listed.


### Life Analogy
It's like checking the security footage to ensure the burglar entered the building *before* the alarm went off, not after.

### Key Points
- `InOrder` class.
- Verifies sequence of invocations.
