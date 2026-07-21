---
id: system-design-018
topic: System Design
difficulty: Senior
format: Open Answer
time: 15
frequency: 75%
source: Custom
prerequisites: ["CQRS", "Architecture"]
---

# Command Query Responsibility Segregation (CQRS)

What is the CQRS pattern? Why is it often used in conjunction with Event Sourcing, and what specific problems does it solve?

---ANSWER---

**CQRS** stands for Command Query Responsibility Segregation. It is a pattern that strictly separates the operations that read data (Queries) from the operations that update data (Commands).

- **Commands**: Operations that change state (e.g., `UpdateUser`, `PlaceOrder`). They do not return data (except perhaps a success status or an ID).
- **Queries**: Operations that read state (e.g., `GetUser`, `ListOrders`). They do not modify state.

**Why use CQRS?**
In traditional systems, the same data model (database tables, ORM entities) is used for both reading and writing. As systems grow, the ways you write data (requiring complex validation and normalization) often conflict with how you read data (requiring fast joins and denormalized views).
CQRS allows you to scale and optimize reads and writes independently. You can even use entirely different databases (e.g., a Relational DB for processing Commands safely, and a NoSQL Elasticsearch cluster for fast Queries).

**Relation to Event Sourcing:**
Event Sourcing makes reads inherently slow because you have to replay events to get the current state. CQRS solves this:
- The **Write Model** appends events to the Event Store.
- The **Read Model** listens to those events and asynchronously builds a denormalized "Projection" (e.g., a fast NoSQL document) that is optimized purely for querying.

### Life Analogy
Think of a restaurant. The Kitchen (Command side) receives orders and changes the state of the food (raw to cooked). They use heavy equipment and complex processes. The Waiter (Query side) reads the menu and the status of the order to the customer. They don't cook the food; they just present the data. The processes are entirely separated.

### Key Points
- Strictly separates Read operations (Queries) from Write operations (Commands).
- Allows independent scaling and optimization of read and write databases.
- Frequently paired with Event Sourcing to create fast Read Projections.
