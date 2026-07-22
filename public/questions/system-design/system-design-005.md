---
id: system-design-005
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 85%
source: Custom
prerequisites: ["Caching", "Databases"]
tags: ['system-design']
---

# Caching Strategies (Cache-Aside, Write-Through)

Explain the Cache-Aside and Write-Through caching patterns. What are their pros and cons? When would you use each?

---ANSWER---

**Cache-Aside (Lazy Loading)**
- *How it works*: The application first checks the cache. If a cache miss occurs, the application fetches the data from the database, writes it to the cache, and returns it.
- *Pros*: Only requested data is cached, avoiding cache pollution. Cache failures don't bring down the system (app falls back to DB).
- *Cons*: Cache misses are slow (three trips: cache check, DB read, cache write). Data can become stale if updated in the DB without invalidating the cache.
- *Use case*: Read-heavy workloads where data doesn't change extremely frequently.

**Write-Through**
- *How it works*: The application writes data directly to the cache. The cache synchronously updates the database before returning a success response to the application.
- *Pros*: Data in the cache is never stale. Read performance is always optimal because data is proactively placed in the cache.
- *Cons*: Write operations are slower (must write to cache and DB synchronously). Cache pollution (data might be written but never read).
- *Use case*: Write-heavy or read-write balanced systems where strong consistency between cache and DB is required, and stale data is unacceptable.

(Other patterns include Write-Behind/Write-Back, where writes to DB are asynchronous, offering very fast writes but risking data loss if the cache crashes).

### Life Analogy
Cache-Aside is like looking up a recipe. You check your memory (cache). If you don't know it, you read the cookbook (DB), memorize it, and cook. Write-Through is like taking notes in class. You write it in your short-term notebook (cache) and immediately copy it to your permanent binder (DB) before the teacher moves on.

### Key Points
- Cache-Aside is reactive: caches only what is read. Good for read-heavy workloads.
- Write-Through is proactive: writes to cache and DB synchronously. Good for maintaining strict consistency but adds latency to writes.
