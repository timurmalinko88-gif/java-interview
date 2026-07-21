---
id: system-design-035
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 65%
source: Custom
prerequisites: ["Caching", "Scalability"]
---

# The Thundering Herd Problem

In the context of caching, what is the "Thundering Herd" (or Cache Stampede) problem? How do you prevent it?

---ANSWER---

**The Problem:**
Imagine a highly trafficked website with an expensive database query (e.g., calculating the top 100 trending articles) that is cached in Redis with a TTL (Time To Live) of 5 minutes. 
At exactly 5:00 PM, the cache expires. In the very next millisecond, 1,000 concurrent user requests arrive. 
Because the cache is empty (a cache miss), *all 1,000 requests* simultaneously query the database to calculate the exact same top 100 articles. This massive spike in load instantly crashes the database. This is the Thundering Herd (or Cache Stampede).

**Solutions:**

1. **Mutex Locks (Locking)**:
   When a cache miss occurs, the first thread acquires a distributed lock (e.g., using Redis `SETNX`). The other 999 threads fail to get the lock and are forced to sleep/wait for a few milliseconds, then check the cache again. The first thread queries the DB, populates the cache, and releases the lock. The other threads wake up, find the data in the cache, and return it.

2. **Probabilistic Early Expiration (XFetch)**:
   Instead of a hard expiration, a thread checking the cache slightly *before* the expiration time has a small, random probability of being told the cache is "expired." That single thread goes to the DB to refresh the cache in the background, while all other concurrent requests are served the slightly stale data.

3. **Background Re-computation (Cron/Worker)**:
   Never let the cache actually expire. Have a separate background worker process calculate the top 100 articles every 4 minutes and simply overwrite the cache in Redis. The user requests never interact with the database; they only read from Redis.

### Life Analogy
Imagine a popular food truck. The menu (cache) blows away in the wind. Suddenly, 50 customers run up to the window and all shout simultaneously, "What's on the menu?!" overwhelming the chef (DB). The solution (Locking) is the chef holding up his hand, making 49 people wait while he tells the first person, who then writes it on a new chalkboard for everyone else to read.

### Key Points
- Occurs when a highly-accessed cache key expires, causing a flood of simultaneous DB queries.
- Can easily bring down a database.
- Solved by distributed locks, early background refresh, or cron jobs.
