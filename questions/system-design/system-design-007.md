---
id: system-design-007
topic: System Design
difficulty: Senior
format: Open Answer
time: 25
frequency: 80%
source: Custom
prerequisites: ["Databases", "Scalability"]
tags: [spring-core, system-design, databases, stream-api, collections]
---

# Database Sharding

What is database sharding? Discuss the common strategies for distributing data across shards (e.g., Hash-based vs Range-based). What are the major challenges associated with sharding?

---ANSWER---

**Database Sharding** is a type of horizontal partitioning where a large database is divided into smaller, faster, and more manageable parts called shards. Each shard is held on a separate database server.

**Sharding Strategies:**
1. **Range-based Sharding**: Data is partitioned based on ranges of the shard key (e.g., User IDs 1-10000 on Shard 1, 10001-20000 on Shard 2).
   - *Pros*: Simple to implement. Good for range queries.
   - *Cons*: Can lead to data hotspots if traffic is concentrated on a specific range (e.g., new sign-ups hitting the last shard).
2. **Hash-based Sharding**: A hash function is applied to the shard key (e.g., `hash(user_id) % num_shards`) to determine the shard.
   - *Pros*: Distributes data evenly, preventing hotspots.
   - *Cons*: Range queries across shards are expensive. Changing the number of shards requires massive data migration (unless Consistent Hashing is used).
3. **Directory-based (Lookup) Sharding**: A lookup table is maintained to map a shard key to a specific shard.
   - *Pros*: Highly flexible.
   - *Cons*: The lookup table can become a single point of failure or bottleneck.

**Challenges of Sharding:**
- **Joins across shards**: Standard SQL joins don't work across separate servers. Must be handled in application logic.
- **Transactions**: Distributed transactions (e.g., Two-Phase Commit) are slow and complex.
- **Resharding**: Moving data when a shard gets too full or when adding new servers is a massive operational headache.

### Life Analogy
Sharding is like managing a growing library. Initially, one librarian handles all books (Monolithic DB). When it gets too big, you split it into wings. Range-based: "A-M in West Wing, N-Z in East Wing." Hash-based: "Fiction goes East, Non-Fiction goes West."

### Key Points
- Sharding scales databases horizontally across multiple servers.
- Range-based can cause hotspots; Hash-based distributes evenly but makes range queries hard.
- Introduces complexity: joins and distributed transactions become difficult or impossible.
