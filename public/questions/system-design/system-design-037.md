---
id: system-design-037
topic: System Design
difficulty: Senior
format: System Design
time: 25
frequency: 75%
source: Custom
prerequisites: ["Databases", "Distributed Systems"]
tags: ['system-design']
---

# Unique ID Generator (Twitter Snowflake)

In a distributed system handling thousands of inserts per second across multiple database shards, you cannot rely on an auto-incrementing integer (like MySQL `AUTO_INCREMENT`) for primary keys. Why not, and how does an algorithm like Twitter Snowflake solve this?

---ANSWER---

**The Problem with Auto-Increment:**
If your database is sharded across 5 servers, Server A and Server B might both generate ID `100` for different users. They are not globally unique. Using a central server to generate IDs creates a Single Point of Failure and a massive bottleneck.
While UUIDs (128-bit strings) solve uniqueness, they are completely random. When inserted into a relational database B-Tree index, random UUIDs cause massive page fragmentation and terrible insert performance. We need IDs that are globally unique *and* sortable by time.

**The Solution (Twitter Snowflake):**
Snowflake generates 64-bit integer IDs (which are fast and index well) completely independently, without coordination between servers.

A 64-bit Snowflake ID is composed of:
1. **Timestamp (41 bits)**: Milliseconds since a custom epoch. This ensures the IDs are sortable by time (meaning new IDs are always greater than old IDs).
2. **Datacenter/Machine ID (10 bits)**: Uniquely identifies the specific server generating the ID. (Supports 1,024 machines).
3. **Sequence Number (12 bits)**: A local counter on the machine that increments for every ID generated *within the exact same millisecond*. (Supports 4,096 IDs per millisecond per machine). It resets to 0 when the millisecond changes.

*Result*: Any server can generate IDs locally. They are guaranteed unique because of the Machine ID, and they are sortable by time because the first 41 bits are a timestamp.

### Life Analogy
Imagine 10 different people stamping tickets at an event. If they just count 1, 2, 3, they will produce duplicates. A UUID is like rolling dice for every ticket (unique but messy). Snowflake is like writing the exact Time, your Booth Number, and the number of tickets you've issued this second. (e.g., `202310271205_Booth4_Ticket01`). It's unique, organized, and no one has to talk to each other.

### Key Points
- Auto-increment fails in sharded DBs. UUIDs are bad for DB index performance.
- Snowflake generates 64-bit integers.
- Structure: Timestamp + Machine ID + Sequence Number.
- Provides unique, time-sortable IDs with zero network coordination.
