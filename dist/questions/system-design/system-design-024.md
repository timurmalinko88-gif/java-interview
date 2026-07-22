---
id: system-design-024
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["Data Structures", "Caching"]
tags: [spring-core, system-design, testing, stream-api, memory, collections]
---

# Bloom Filters

What is a Bloom Filter? How does it work under the hood, and what specific problem does it solve in system design?

---ANSWER---

A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set.

**The Problem:**
Imagine you have a database of 1 billion registered usernames. When a user tries to sign up, you must check if the username is taken. Querying the database every time is slow. Caching 1 billion strings in memory (Redis) takes hundreds of gigabytes.

**The Solution (Bloom Filter):**
- It guarantees: "The item is definitely not in the set" or "The item is *probably* in the set." (False positives are possible; false negatives are not).

**How it works:**
1. It uses a bit array of `m` bits, all initialized to `0`.
2. When an item is added (e.g., "john123"), it is passed through `k` different hash functions.
3. The hashes result in `k` array positions. Those bits are set to `1`.
4. To check if "mary456" exists, you hash it `k` times.
   - If *any* of those bits are `0`, the item **definitely does not exist**. (Fast exit!).
   - If *all* of those bits are `1`, the item **probably exists**. (It might be a collision from other words). Only then do you perform the expensive database query to verify.

**Use cases:**
- Preventing expensive disk/DB lookups for missing keys (Cassandra uses this).
- Checking weak passwords, malicious URLs, or duplicate recommendations.

### Life Analogy
It's like a bouncer at a club who uses a fast but slightly flawed face scanner. If the scanner says "Not on the list", you definitely aren't getting in. If it says "Maybe on the list", the bouncer takes the time to manually check your physical ID against a massive paper ledger. Most people are instantly rejected, saving the bouncer's time.

### Key Points
- Extremely space-efficient.
- Cannot return false negatives (if it says NO, it's definitely NO).
- Can return false positives (if it says YES, you must verify).
