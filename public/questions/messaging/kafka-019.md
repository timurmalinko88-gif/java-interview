---
id: kafka-019
path: questions/messaging/kafka-019.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Saga Pattern (Orchestration vs Choreography)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, microservices, sagas]
---

# Saga Pattern (Orchestration vs Choreography)
How do you handle distributed transactions across multiple microservices using the Saga Pattern? Compare the Choreography and Orchestration approaches, highlighting how Kafka is used in each.

---ANSWER---

In a monolithic application, if an action requires updating three different database tables, you use a single ACID database transaction. If the third update fails, the whole transaction rolls back. 
In a microservices architecture, those three tables belong to three different services with separate databases. You cannot use a single ACID transaction. To maintain data consistency across services, we use the **Saga Pattern**.

A Saga is a sequence of local transactions. Each service performs its local transaction and publishes an event. If a local transaction fails, the Saga executes a series of **compensating transactions** to undo the changes made by the preceding services.

There are two primary ways to coordinate a Saga: Choreography and Orchestration.

**1. Choreography (Event-Driven)**
In Choreography, there is no central controller. Services subscribe to each other's events and react accordingly. Kafka acts as the central nervous system.
*   **Flow:** 
    1. Order Service creates a `PENDING` order and publishes `OrderCreated` to Kafka.
    2. Payment Service consumes `OrderCreated`, charges the card, and publishes `PaymentSuccessful`.
    3. Inventory Service consumes `OrderCreated`, reserves items, and publishes `InventoryReserved`.
    4. Order Service consumes both success events and updates the order to `APPROVED`.
*   **Rollback:** If Payment fails, it publishes `PaymentFailed`. Inventory consumes this and releases the reserved items (compensation).
*   **Pros:** Highly decoupled, no single point of failure, very fast.
*   **Cons:** Complex to monitor. The overall business process is implicit and scattered across multiple codebases. Hard to debug if something gets stuck. Best for simple workflows (2-4 steps).

**2. Orchestration (Command-Driven)**
In Orchestration, a central "Orchestrator" service manages the entire lifecycle of the transaction. It acts as a state machine, explicitly commanding other services what to do. Kafka is used as the transport layer for these commands and replies.
*   **Flow:**
    1. Order Service creates a `PENDING` order and starts the Saga Orchestrator.
    2. Orchestrator sends a `ChargeCard` command to the Payment Service via Kafka. Payment replies `Success`.
    3. Orchestrator sends a `ReserveItems` command to Inventory via Kafka. Inventory replies `Success`.
    4. Orchestrator marks the Saga complete and updates the Order to `APPROVED`.
*   **Rollback:** If Inventory replies `Failed` (out of stock), the Orchestrator explicitly sends a `RefundCard` command to the Payment service to compensate.
*   **Pros:** Centralized logic. Easy to monitor the state of the transaction. Easy to implement complex branching logic and timeouts.
*   **Cons:** The Orchestrator becomes a central point of failure and a potential bottleneck. It introduces tighter coupling as the orchestrator must know about the APIs/commands of the other services. Best for complex workflows.

### Examples
```java
// Choreography Example: Inventory reacting to an event
@KafkaListener(topics = "order-events")
public void handleOrderEvents(OrderEvent event) {
    if (event.getType() == EventType.ORDER_CREATED) {
        inventoryService.reserve(event.getItems());
    } else if (event.getType() == EventType.PAYMENT_FAILED) {
        // Compensating action
        inventoryService.release(event.getItems()); 
    }
}
```

### Life Analogy
**Choreography** is like a dance troupe without a conductor. The music starts (an event), the lead dancer moves, the other dancers see that move and immediately know what their corresponding move should be. It's fluid and fast, but if one dancer trips, the others have to figure out how to recover on the fly based purely on seeing the mistake.

**Orchestration** is like a symphony orchestra with a conductor. The conductor points to the violins and commands them to play (sends a command). Then they point to the cellos. The musicians don't need to look at each other, they just follow the conductor. If the violins mess up, the conductor explicitly signals the cellos to stop and restart.

### Key Points
- Sagas replace distributed ACID transactions by using sequences of local transactions and compensating actions for rollbacks.
- **Choreography:** Decentralized, event-driven. Services react to Kafka events from other services. Harder to monitor, easier to decouple.
- **Orchestration:** Centralized controller sends commands via Kafka and waits for replies. Easier to monitor and manage complex workflows, but introduces a single point of failure.
