---
id: multithreading-004
topic: Multithreading
difficulty: Middle
format: Code Review
estimated_time_minutes: 10
frequency: High
related_questions: [Difference between HashMap and ConcurrentHashMap, computeIfAbsent method]
source: Custom
prerequisites: [ConcurrentHashMap, Race Condition]
tags: [oop, spring-core, system-design, patterns, stream-api, memory, multithreading, collections, exceptions]
---

A developer implemented a thread-safe user cache based on `ConcurrentHashMap`. Look at the code below (Java 17). It compiles successfully. Find bugs and vulnerabilities when working in a multithreaded environment and suggest how to fix them.

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserCache {
    private final Map<String, User> cache = new ConcurrentHashMap<>();

    public User getUser(String userId) {
        User user = cache.get(userId);
        if (user == null) {
            user = loadUserFromDatabase(userId); // The method takes ~200ms
            cache.put(userId, user);
        }
        return user;
    }

    private User loadUserFromDatabase(String userId) {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new User(userId, "Name_" + userId);
    }

    public record User(String id, String name) {}
}
```

---ANSWER---

There is a classic **"Check-Then-Act" Race Condition** present in the code.

Despite using `ConcurrentHashMap`, the `get` and `put` methods are called separately. The map itself protects against corruption of its internal structure, but it does not guarantee the atomicity of the sequence of actions.

If two threads request `getUser("id1")` simultaneously, they will both receive `null` from `cache.get()`, they will both go into the `loadUserFromDatabase()` method, and they will execute the "heavy" database query twice, sequentially overwriting the values in the map afterwards. Under high load, the database will crash from duplicated queries (Cache Stampede).

**How to fix it:**

You need to use the atomic `computeIfAbsent` method, which locks the map segment (or bucket) only for a specific key during computation.

**Fixed code:**

```java
public User getUser(String userId) {
    // Will load from the DB only once for a single key,
    // other threads with the same key will wait for the result
    return cache.computeIfAbsent(userId, this::loadUserFromDatabase);
}
```

*Additional nuance:* Catching `InterruptedException` and restoring the interrupt flag with `Thread.currentThread().interrupt()` is done correctly, but in the original code, we still return a fake user after this, which might be incorrect for business logic (it's better to throw an Exception or return null/Optional).

* The pattern `if (map.get(key) == null) { map.put(key, val); }` is prone to a race condition (Check-Then-Act).
* The `computeIfAbsent` method provides atomic checking and initialization of a key.
* `computeIfAbsent` only blocks the computation for a specific key, without preventing parallel threads from working with other keys.

### Life Analogy

You and your roommate (two threads) look into the fridge (ConcurrentHashMap) at the same time. There is no milk (returns null). Without agreeing, you both go to the store and buy a carton of milk each. Now you have two cartons instead of one (double load on the DB). Using `computeIfAbsent` is like leaving a note on the fridge saying "I went for milk", so the second roommate simply waits.

### Key Points
* `ConcurrentHashMap` guarantees thread safety for single operations (put, get), but not for their combinations.
