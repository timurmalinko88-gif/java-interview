---
id: testing-002
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Mockito"]
tags: ['testing']
---

# @Mock vs @InjectMocks

In Mockito, what is the difference between `@Mock` and `@InjectMocks`? Provide a brief example.

---ANSWER---

In Mockito, both annotations are used to simplify test setup, but they serve entirely different purposes:

- **`@Mock`:** Used to create and inject mocked instances of a class or interface. A mock replaces the real implementation with a dummy one that you can control (stub methods, verify interactions).
- **`@InjectMocks`:** Used to create an instance of the class under test and automatically inject the mocks (created with `@Mock` or `@Spy`) into it.

**Example:**
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private PaymentRepository paymentRepository; // The dependency (mocked)

    @InjectMocks
    private OrderService orderService; // The class being tested (real instance)

    @Test
    void testOrder() {
        // Here, orderService automatically has the mocked paymentRepository injected.
    }
}
```

### Life Analogy
Imagine testing a car engine (the class under test). `@Mock` creates fake components like a fake battery or fake spark plugs that you can control. `@InjectMocks` is the mechanic who automatically takes those fake components and installs them into the real engine so you can test it.

### Key Points
- `@Mock` creates fake dependency objects.
- `@InjectMocks` creates the real object being tested and injects the mocks into it.
- Requires `MockitoExtension` (JUnit 5) or `MockitoAnnotations.openMocks(this)` to process annotations.
