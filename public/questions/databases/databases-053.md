---
id: databases-053
topic: Databases
difficulty: Middle
format: Code Review
time: 10
frequency: 90%
source: Verdict Review
prerequisites: ["Transactions", "HikariCP", "Connection Pooling", "Spring @Transactional"]
tags: ['verdict-review', 'databases', 'transactions', 'spring']
---

# External HTTP Calls inside @Transactional: HikariCP Pool Starvation

Spot the critical concurrency flaw in the following Spring Boot service method. What happens under high load, and how must this code be refactored?

```java
@Service
@RequiredArgsConstructor
public class PaymentProcessingService {

    private final OrderRepository orderRepository;
    private final ThirdPartyPaymentClient paymentClient; // External REST call
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void processPayment(Long orderId, PaymentDetails details) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));

        order.setStatus(OrderStatus.PAYMENT_PENDING);
        orderRepository.save(order);

        // ⚠️ External HTTP REST call to payment gateway (takes 2 - 5 seconds)
        PaymentResponse response = paymentClient.charge(details);

        if (response.isSuccessful()) {
            order.setStatus(OrderStatus.PAID);
            auditLogRepository.save(new AuditLog(orderId, "Payment successful"));
        } else {
            order.setStatus(OrderStatus.FAILED);
        }
        orderRepository.save(order);
    }
}
```

---ANSWER---

### Critical Flaw: Database Connection Pool Starvation

1. **Connection Lifetime:** When entering a `@Transactional` method, Spring acquires a database connection from the pool (e.g. HikariCP) and begins a database transaction.
2. **Holding Connections during I/O:** The connection is held open for the **entire duration** of the method, including the external HTTP call to `paymentClient.charge()`.
3. **The Disaster under Load:**
   - Third-party API calls take **2,000–5,000 ms** (or longer if the payment gateway lags).
   - The default HikariCP pool size is **10 connections**.
   - If just 10 concurrent users trigger payment, all 10 DB connections are held waiting for remote HTTP sockets.
   - Every other thread in the application (even simple `SELECT` queries) freezes waiting for a DB connection, resulting in `ConnectionTimeoutException` and total service blackout.

### How to Fix: Shorten the Transaction Boundary

Never perform slow network I/O, file operations, or external API calls inside an active database transaction.

```java
@Service
@RequiredArgsConstructor
public class PaymentProcessingService {

    private final OrderRepository orderRepository;
    private final ThirdPartyPaymentClient paymentClient;
    private final TransactionTemplate transactionTemplate;

    public void processPayment(Long orderId, PaymentDetails details) {
        // Step 1: Short DB transaction to mark pending
        transactionTemplate.executeWithoutResult(status -> {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
            order.setStatus(OrderStatus.PAYMENT_PENDING);
            orderRepository.save(order);
        }); // DB connection released immediately!

        // Step 2: External HTTP call outside of any DB transaction
        PaymentResponse response = paymentClient.charge(details);

        // Step 3: Short DB transaction to update final status
        transactionTemplate.executeWithoutResult(status -> {
            Order order = orderRepository.findById(orderId).orElseThrow();
            order.setStatus(response.isSuccessful() ? OrderStatus.PAID : OrderStatus.FAILED);
            orderRepository.save(order);
        });
    }
}
```

### Key Takeaways
- `@Transactional` holds a physical DB connection throughout the entire method execution.
- External REST calls or messaging must happen **outside** the transaction boundary.
- Use `TransactionTemplate` or separate orchestrator service methods to keep transactions measured in milliseconds.\n