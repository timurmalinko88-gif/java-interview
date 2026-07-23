---
id: kafka-011
path: questions/messaging/kafka-011.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Event Sourcing & CQRS with Kafka
time: 15 min
frequency: Medium
tags: [kafka, messaging, architecture, cqrs, events]
---

# Event Sourcing & CQRS with Kafka
How can Kafka be used as the foundation for an Event Sourcing and CQRS architecture? What are the benefits and primary challenges of this approach?

---ANSWER---

**Event Sourcing** and **CQRS (Command Query Responsibility Segregation)** are architectural patterns that often go hand-in-hand and pair exceptionally well with Kafka's distributed, immutable append-only log.

**Event Sourcing with Kafka:**
In a traditional CRUD database, you store the *current state* of an entity (e.g., `Balance: $50`). In Event Sourcing, you do not store the current state; instead, you store a sequence of immutable *events* that led to that state (e.g., `AccountOpened($0)`, `Deposited($100)`, `Withdrew($50)`). 

Kafka acts as the perfect Event Store for this. 
1.  **Immutability:** Kafka topics are append-only. Once an event is written, it cannot be changed, providing a perfect, auditable historical record.
2.  **Retention:** By setting a topic's retention to `infinite`, Kafka stores the entire history of the application permanently.
3.  **Replayability:** If you need to know the current balance, you start at the beginning of the Kafka topic and replay the events (`0 + 100 - 50 = 50`). If you find a bug in how balances are calculated, you fix the code, reset your consumer offset to 0, and replay the entire history to arrive at the correct new state.

**CQRS with Kafka:**
Calculating the current state by replaying thousands of events every time a user wants to view their balance is extremely slow. This is where CQRS comes in. CQRS dictates that the system for *writing* data (Commands) should be separated from the system for *reading* data (Queries).

1.  **Command Side (Write):** A service receives an action (e.g., "Withdraw Money"). It validates it and, if valid, publishes an `MoneyWithdrawn` event to the Kafka Event Store topic.
2.  **Query Side (Read):** A separate service (or multiple services) acts as a Kafka consumer. It listens to the Event Store topic, consumes the `MoneyWithdrawn` event, and updates a heavily optimized "Read Database" (e.g., updating a row in PostgreSQL, or a document in Elasticsearch/MongoDB). 

When a user requests their balance, the UI simply queries this optimized Read Database, providing sub-millisecond response times.

**Challenges:**
*   **Eventual Consistency:** The Read Database is updated asynchronously. A user might make a deposit, immediately refresh the page, and not see the new balance because the Query service hasn't processed the Kafka event yet. UIs must be designed to handle this (e.g., optimistic UI updates).
*   **Complexity:** It requires shifting from a simple CRUD mindset to a complex, asynchronous, distributed mindset. Schema evolution for events requires strict discipline (using Schema Registries).

### Examples
```java
// Command Side (Produces Event)
public void handleDepositCommand(DepositCommand cmd) {
    // Validate command...
    AccountDepositedEvent event = new AccountDepositedEvent(cmd.getAccountId(), cmd.getAmount());
    kafkaTemplate.send("account-events", cmd.getAccountId(), event); // Key by AccountId to ensure order
}

// Query Side (Consumes Event and updates Read Model)
@KafkaListener(topics = "account-events", groupId = "read-model-updater")
public void updateReadModel(Event event) {
    if (event instanceof AccountDepositedEvent) {
        // Update optimized MongoDB collection for fast querying
        readDatabase.incrementBalance(event.getAccountId(), event.getAmount());
    }
}
```

### Life Analogy
Traditional CRUD is like a chalkboard. You write a number, erase it, and write a new one. You only know the current state.

Event Sourcing is like an accountant's ledger book. You never erase anything; you only write new lines for every transaction (deposits, withdrawals). Kafka is the indestructible ledger book.

CQRS is like having two desks. The accountant works at the first desk (Command), carefully writing every transaction into the ledger. An assistant works at the second desk (Query). The assistant reads the ledger over the accountant's shoulder, does the math, and writes the *final current totals* on a whiteboard. When the boss asks for the total, they just look at the whiteboard (fast), rather than making the accountant manually add up all the ledger pages (slow).

### Key Points
- Event Sourcing stores changes as a sequence of immutable events rather than current state.
- Kafka is an ideal Event Store due to infinite retention and ordered, append-only logs.
- CQRS separates Write (Commands) from Read (Queries) workloads.
- Consumers read Kafka events to asynchronously update highly-optimized Query databases.
- Introduces Eventual Consistency, which must be handled at the UX level.
