---
id: system-design-050
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["Databases", "Architecture"]
tags: ['system-design']
---

# Change Data Capture (CDC)

What is Change Data Capture (CDC)? How does it differ from traditional batch ETL processes, and what are its main use cases?

---ANSWER---

**The Problem:**
You have a primary relational database (PostgreSQL) handling live transactions. You also have an Elasticsearch cluster for full-text search, and a Data Warehouse for analytics. How do you keep the search index and warehouse synchronized with the primary database?
- *Polling*: Writing a cron job that runs `SELECT * FROM users WHERE updated_at > X` every 5 minutes puts heavy load on the DB and has a 5-minute delay.
- *Dual-Writes*: Having the application explicitly write to Postgres and then write to Elasticsearch is risky (if the second write fails, data is permanently inconsistent).

**Change Data Capture (CDC):**
CDC is a software design pattern used to determine and track the data that has changed in a database so that action can be taken using the changed data in real-time.

**How it works (Log-Based CDC):**
Instead of querying the database, tools like **Debezium** directly read the database's internal transaction log (Write-Ahead Log in Postgres, or Binlog in MySQL).
Every time an INSERT, UPDATE, or DELETE happens, Debezium reads it from the log and instantly publishes an event to a message broker like Apache Kafka. Downstream systems (Elasticsearch, Data Warehouse) consume these Kafka events and update themselves in near real-time.

**Pros:**
- **Zero impact on DB performance**: Reading logs doesn't execute SQL queries.
- **Real-time**: Latency is in milliseconds, not minutes/hours.
- **Captures all events**: Includes hard deletes (which polling misses because the row is gone).

### Life Analogy
Polling is like calling your bank every day to ask, "Did any money enter my account today?" It wastes time. CDC is like the bank setting up an automated SMS alert. The second a transaction clears their internal ledger, they push a notification straight to your phone.

### Key Points
- CDC captures database changes by reading internal transaction logs (WAL/binlog).
- Streams changes to Kafka for downstream consumption in real-time.
- Replaces slow, resource-heavy ETL polling and fragile dual-write setups.
