---
id: system-design-010
topic: System Design
difficulty: Senior
format: Open Answer
time: 25
frequency: 70%
source: Custom
prerequisites: ["Hashing", "Distributed Systems"]
tags: ['system-design']
---

# Consistent Hashing

What is Consistent Hashing? What problem does it solve in distributed caching or database sharding systems?

---ANSWER---

**The Problem:**
In standard hash-based sharding, you route data to a server using `hash(key) % N` (where N is the number of servers). If you add or remove a server, N changes. This means almost *every* key will hash to a new server, requiring massive data movement and causing catastrophic cache misses.

**Consistent Hashing:**
Consistent Hashing is a technique that minimizes data movement when servers are added or removed.
1. **The Hash Ring**: Imagine a circle (ring) where the hash values are mapped from `0` to `2^32 - 1`.
2. **Placing Servers**: Hash the IP or ID of your servers and place them on this ring.
3. **Placing Data**: Hash the data key to get a position on the ring.
4. **Routing**: To find which server holds the data, walk clockwise from the data's hash position until you hit a server.
5. **Adding/Removing**: If a server goes down, only the data mapped to that specific server needs to move (to the next server clockwise). If a new server is added, it only takes over a small portion of data from its clockwise neighbor.

**Virtual Nodes:**
To prevent uneven data distribution (where one server gets a massive slice of the ring), "Virtual Nodes" are used. Each physical server is hashed multiple times with different labels (e.g., NodeA-1, NodeA-2) to place it uniformly around the ring.

### Life Analogy
Imagine a circular dinner table with 4 waiters equally spaced. Each waiter serves the section immediately to their left. If a 5th waiter squeezes in, they only take over half the section from the waiter to their left. The other 3 waiters' sections remain completely unchanged.

### Key Points
- Solves the massive data redistribution problem when adding/removing nodes in a distributed system.
- Standard modulo hashing requires moving nearly 100% of data; consistent hashing moves only `1/N` of the data.
- Virtual nodes are crucial for balancing the load evenly across the ring.
