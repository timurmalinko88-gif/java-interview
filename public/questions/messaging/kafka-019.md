---
id: kafka-019
path: questions/messaging/kafka-019.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Saga Pattern (Orchestration vs Choreography)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# The Saga Pattern (Orchestration vs Choreography)

In a monolithic application, maintaining data consistency across different business entities is straightforward: you use a single relational database and wrap the operations in an ACID transaction (e.g., `BEGIN; UPDATE inventory; UPDATE billing; COMMIT;`).

In a microservices architecture, data is distributed. The `InventoryService` has its own database, and the `BillingService` has its own. You cannot use traditional ACID transactions across multiple microservices without severe performance and availability penalties (e.g., using Two-Phase Commit / 2PC).

To solve distributed transactions, we use the **Saga Pattern**. A Saga is a sequence of local transactions. Each service performs its local transaction and publishes an event. This event triggers the next local transaction in the saga. If a step fails, the saga executes a series of **compensating transactions** to undo the work completed by the preceding steps.

There are two primary ways to coordinate a Saga: Choreography and Orchestration.

## 1. Choreography (Event-Driven)

In Choreography, there is no central controller. Services listen to events from other services and react accordingly. It is decentralized. Apache Kafka is the perfect backbone for this.

**The Flow (E-commerce Order):**
1.  `OrderService` creates a Pending Order and publishes an `OrderCreated` event to Kafka.
2.  `InventoryService` listens for `OrderCreated`, reserves the item, and publishes an `InventoryReserved` event.
3.  `BillingService` listens for `InventoryReserved`, charges the credit card, and publishes `PaymentSuccessful`.
4.  `OrderService` listens for `PaymentSuccessful` and marks the order as Approved.

**Failure & Compensation:**
If `BillingService` fails (card declined), it publishes a `PaymentFailed` event. The `InventoryService` listens for this and executes a compensating transaction to release the reserved items back into stock.

**Pros of Choreography:**
*   **Highly Decoupled:** Services only know about events, not about other services.
*   **No Single Point of Failure:** There is no central orchestrator that can crash.
*   **Agile:** Easy to add a new step (e.g., a `ShippingService`) just by having it listen to the `PaymentSuccessful` event.

**Cons of Choreography:**
*   **Hard to Understand (Spaghetti):** The business logic is scattered across multiple codebases. To understand the complete flow of an order, you have to trace events across many services.
*   **Cyclic Dependencies:** Services can easily get caught in infinite event loops if not careful.
*   **Testing is Difficult:** Integration testing requires spinning up many services and tracking asynchronous event flows.

## 2. Orchestration (Command-Driven)

In Orchestration, there is a central coordinator (the Orchestrator). The orchestrator tells the participants what to do, waits for their responses, and decides the next step. 

This is often implemented using a state machine (like AWS Step Functions, Camunda, or a custom service).

**The Flow (E-commerce Order):**
1.  User places an order. The request goes to the `OrderSagaOrchestrator`.
2.  The Orchestrator creates a Pending Order in the DB.
3.  The Orchestrator sends a *Command* (via sync REST or async message) to the `InventoryService`: "Reserve Items".
4.  `InventoryService` replies "Success".
5.  The Orchestrator receives the success, then sends a Command to `BillingService`: "Charge Card".
6.  `BillingService` replies "Success".
7.  The Orchestrator marks the Order as Approved.

**Failure & Compensation:**
If `BillingService` replies "Failed", the Orchestrator knows the current state. It actively sends a Command to the `InventoryService`: "Release Items".

**Pros of Orchestration:**
*   **Centralized Logic:** The entire business flow is defined in one place. It is easy to understand, monitor, and debug.
*   **Avoids Cyclic Dependencies:** The orchestrator controls the flow explicitly.
*   **Easier Testing:** You can test the orchestrator in isolation by mocking the downstream services.

**Cons of Orchestration:**
*   **Coupling:** The orchestrator needs to know about the APIs/Commands of all participating services.
*   **Single Point of Failure/Bottleneck:** If the orchestrator goes down or slows down, the entire business process halts. (Though modern tools mitigate this with high availability setups).
*   **Risk of "God Service":** Developers might put too much business logic into the orchestrator, turning it into a monolithic chokepoint rather than just a coordinator.

## Summary

Use **Choreography** with Kafka for simple workflows with 2-4 steps where loose coupling and agility are paramount.
Use **Orchestration** for complex, critical business workflows (like financial transactions or long-running processes) where you need strict control, easy monitoring, and clear state management.
