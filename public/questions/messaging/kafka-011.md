---
id: kafka-011
path: questions/messaging/kafka-011.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Event Sourcing & CQRS with Kafka
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Event Sourcing & CQRS with Kafka

Event Sourcing and Command Query Responsibility Segregation (CQRS) are two distinct architectural patterns that are frequently used together, with Apache Kafka serving as the ideal backbone to connect them.

## Event Sourcing

Traditional databases store the *current state* of an entity. If you update a user's address, the old address is overwritten and lost forever (unless you build complex auditing tables).

**Event Sourcing** flips this model. Instead of storing current state, you store a sequence of immutable *events* that describe every state change that has ever occurred. The current state is derived by replaying these events from the beginning.

### How Kafka Enables Event Sourcing
Kafka's fundamental abstraction is the distributed commit log. This makes it a natural fit for Event Sourcing:
*   **Immutability:** Kafka topics are append-only. You cannot edit a message once it's written.
*   **Ordering:** Kafka guarantees strict ordering of events within a partition (e.g., all events for `Order ID 123` are processed in the exact order they occurred).
*   **Durability:** With infinite retention (or compacted topics), Kafka can store the entire history of an application indefinitely.

**Example:**
Instead of a database row: `Order {id: 1, status: SHIPPED}`
You have a Kafka topic `order-events` containing:
1.  `OrderCreated {id: 1, items: [...]}`
2.  `PaymentProcessed {id: 1}`
3.  `OrderShipped {id: 1, tracking: "ABC"}`

To find the current state of Order 1, a service consumes these three events and builds an in-memory representation.

## CQRS (Command Query Responsibility Segregation)

CQRS states that the model used to *update* data (Commands) should be separated from the model used to *read* data (Queries).

*   **Command Side (Write):** Optimized for complex business logic, validation, and maintaining transactional integrity.
*   **Query Side (Read):** Optimized for extremely fast reads. Data is often denormalized, flattened, or stored in search indexes (like Elasticsearch) or caching layers (like Redis).

### Why combine them?
In a purely Event Sourced system, querying is hard. If a user asks, "Show me all shipped orders," you cannot easily query an append-only log of events. You would have to replay the entire log to build the state of every order just to filter them.

**This is where CQRS comes in.**

## The Event Sourcing + CQRS Architecture with Kafka

1.  **The Command:** A user initiates an action (e.g., checkout). The Command Service validates the request.
2.  **Event Generation:** The Command Service generates an event (e.g., `OrderCreated`) and publishes it to a Kafka topic. This topic *is* the Event Store (the single source of truth).
3.  **The Projection (The Bridge):** Various "Projector" services (or Kafka Streams applications) subscribe to this Kafka topic.
4.  **Building the Read Model:** As Projectors consume events, they update specialized Read Databases.
    *   *Projector A* might update a PostgreSQL database optimized for an "Order History" UI.
    *   *Projector B* might push data into Elasticsearch for full-text search.
5.  **The Query:** When a user views their dashboard, the UI queries the Read Database directly (via a Query Service), which is blazing fast because the data is already pre-calculated and formatted for that specific view.

### Advantages
*   **Extreme Scalability:** Read and write workloads can be scaled independently.
*   **Auditability:** You have a perfect, immutable history of everything that ever happened in the system.
*   **Flexibility:** If business requirements change, you can spin up a new Projector, read the Kafka topic from the beginning (offset 0), and build a completely new Read Database without impacting existing systems.

### Disadvantages
*   **Eventual Consistency:** The Read model is updated asynchronously. When a user submits a command, it takes a few milliseconds (or more, if lagging) for the read database to reflect the change. UIs must be designed to handle this (e.g., optimistic UI updates).
*   **Complexity:** The architecture has many moving parts and steep learning curves.
