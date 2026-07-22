---
id: collections-004
topic: Collections
difficulty: Senior
format: System Design
time: 15
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Hashing"]
tags: [spring-core, system-design, stream-api, memory, multithreading, collections]
---

# ConcurrentHashMap Internal Working
How does `ConcurrentHashMap` achieve thread safety and high performance compared to `HashTable` or a `Collections.synchronizedMap()`?

---ANSWER---

`ConcurrentHashMap` is designed for concurrent use. Instead of synchronizing every method on a single lock (like `HashTable` or `Collections.synchronizedMap()` do), it uses finer-grained locking mechanisms.

**Before Java 8:**
It used a technique called **lock striping**. The internal map was divided into a set of independent "segments" (by default 16). Each segment acted like an independent hash table with its own lock. This allowed up to 16 threads to write to the map concurrently, provided they were writing to different segments. Reads generally didn't require locks.

**Java 8 and later:**
The segment-based approach was dropped to improve performance and memory usage. Now, it operates more like a regular `HashMap` (using nodes and an array of buckets), but it achieves thread-safety using **Compare-And-Swap (CAS)** operations and synchronizing only on the first node (head) of the specific bucket being modified. 
- For empty buckets, a new node is inserted using a lock-free CAS operation.
- If the bucket is not empty, it locks only the first node of the list/tree for that specific bucket.
- Reads (get) are completely lock-free because nodes use `volatile` variables for visibility.

### Life Analogy
Imagine a huge library (the Map). `HashTable` gives one key to the entire library—only one person can enter at a time. `ConcurrentHashMap` in Java 8 gives a separate key to every single bookshelf (bucket). Multiple people can add books at the same time as long as they are working on different bookshelves. Readers don't need a key at all.

### Key Points
- Does not lock the entire map.
- Java 8 uses CAS operations and synchronized blocks on individual bucket heads.
- Allows highly concurrent read and write operations without blocking the entire data structure.
