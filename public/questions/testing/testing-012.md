---
id: testing-012
topic: Testing
difficulty: Senior
format: Code Review
time: 10
frequency: 60%
source: Custom
prerequisites: ["Mockito"]
tags: ['testing']
---

# Mockito ArgumentCaptor

When and how do you use `ArgumentCaptor` in Mockito?

---ANSWER---

`ArgumentCaptor` is used when you need to inspect the exact arguments passed to a mocked method, especially if those arguments are complex objects created or modified inside the method under test.

**Code Example & Usage:**

```java
@Test
void testOrderProcessing() {
    // Given
    OrderService orderService = new OrderService(notificationServiceMock);
    
    // When
    orderService.placeOrder("ITEM-101", 3);
    
    // Then: capture the internal OrderNotification object created inside placeOrder()
    ArgumentCaptor<OrderNotification> captor = ArgumentCaptor.forClass(OrderNotification.class);
    verify(notificationServiceMock).sendNotification(captor.capture());
    
    OrderNotification captured = captor.getValue();
    assertEquals("ITEM-101", captured.getItemId());
    assertEquals(3, captured.getQuantity());
}
```
**When to use ArgumentCaptor vs eq():** Use standard matchers like `eq()` or `any()` for simple primitive arguments. Use `ArgumentCaptor` when the object is instantiated internally inside the method under test, or when deep field assertions are required.


### Life Analogy
It's like a security camera at a toll booth. You don't just verify that a car passed through; you capture the license plate so you can check it later.

### Key Points
- Captures arguments passed to a mock.
- Useful for asserting on complex internal state changes.
- Used during the `verify` phase.
