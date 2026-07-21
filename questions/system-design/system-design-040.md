---
id: system-design-040
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 65%
source: Custom
prerequisites: ["Distributed Systems", "Consensus Algorithms"]
---

# Vector Clocks

In a distributed, highly available database like Amazon DynamoDB or Riak, two users might modify the same shopping cart on two different nodes simultaneously. Since servers have slightly different system clocks, you can't just use timestamps to resolve the conflict. Explain how Vector Clocks solve this.

---ANSWER---

**The Timestamp Problem (NTP Drift):**
Physical server clocks drift. Server A might think it's 10:00:00, while Server B thinks it's 10:00:01. If Server A receives an update *after* Server B, it might stamp it with an earlier time. Using "Last Write Wins" based on physical timestamps will result in silent data loss.

**Vector Clocks:**
A vector clock is an algorithm for generating a partial ordering of events in a distributed system to detect causality and conflicts. It tracks the *version history* of an object across different nodes.

Instead of a single timestamp, the version is an array (vector) of counters for each node that modifies the data: `[NodeA: 1, NodeB: 0]`.

**How it works (Shopping Cart Example):**
1. Client adds "Apple". Node A handles it. Version is `[A:1]`.
2. Client adds "Banana". Node A handles it. Version updates to `[A:2]`. (We know `A:2` is newer than `A:1`, so we overwrite it).
3. **Network Partition!** The client opens two tabs.
4. Tab 1 adds "Orange". Routed to Node A. Version is `[A:3]`.
5. Tab 2 adds "Grapes". Routed to Node B. Node B bases its update on the last known version `[A:2]`. It increments its own counter. Version is `[A:2, B:1]`.
6. **Conflict Detection**: Later, the database tries to synchronize. It compares `[A:3]` and `[A:2, B:1]`. 
   - Neither vector is strictly greater than the other in all indices. 
   - The database *knows mathematically* that these two events happened concurrently and constitute a conflict.
7. **Resolution**: The database cannot solve this. It returns *both* conflicting carts to the client application and forces the client to resolve it (e.g., merging them so the cart has Apple, Banana, Orange, and Grapes).

### Life Analogy
Imagine editing a Google Doc without the internet. You download V1. Alice edits it (V1-Alice1). Bob downloads V1 and edits it (V1-Bob1). When they both reconnect, the system doesn't care who hit "Save" at what physical time. It looks at the history tags. It sees they both diverged from V1 independently. It flags a conflict and asks them to merge manually.

### Key Points
- Physical timestamps are unreliable in distributed systems.
- Vector clocks track the causal history of updates per node.
- They do not *resolve* conflicts; they *detect* concurrent modifications so the application can resolve them without silent data loss.
