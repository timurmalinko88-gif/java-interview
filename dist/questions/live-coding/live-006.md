---
id: live-006
path: questions/live-coding/live-006.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: In-Memory LRU Cache with TTL
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# In-Memory LRU Cache with TTL
The provided class attempts to implement a simple LRU (Least Recently Used) cache using `LinkedHashMap`. However, it lacks a mechanism to automatically expire entries after a certain Time-To-Live (TTL). 

Can you refactor the code to properly support both the LRU eviction policy based on capacity and a TTL-based eviction for stale data?

---ANSWER---

`LinkedHashMap` in Java is perfectly suited for an LRU cache because its constructor takes an `accessOrder` boolean parameter. When set to `true`, the map orders its entries based on the last access time rather than insertion time. By overriding the `removeEldestEntry` method, we can enforce a maximum capacity constraint.

To add TTL support, we need to wrap our values in an object that also records the timestamp of insertion. When `get()` is called, we check if the entry has expired. If it has, we remove it from the map and return `null`. This implements "lazy eviction". 
To prevent memory buildup of expired items that are never accessed, `removeEldestEntry` can also be modified to sweep expired items, or a background cleanup thread could be used (though lazy eviction is usually sufficient for simple interview implementations).

### Examples
```java
// REFACTORED CODE:
import java.util.LinkedHashMap;
import java.util.Map;

public class LruTtlCache<K, V> {
    private final long ttlMillis;
    private final Map<K, CacheEntry<V>> cache;

    public LruTtlCache(int capacity, long ttlMillis) {
        this.ttlMillis = ttlMillis;
        // true for access-order (LRU)
        this.cache = new LinkedHashMap<K, CacheEntry<V>>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, CacheEntry<V>> eldest) {
                // Evict if capacity exceeded OR if the eldest is expired
                return size() > capacity || eldest.getValue().isExpired();
            }
        };
    }

    public synchronized void put(K key, V value) {
        cache.put(key, new CacheEntry<>(value, System.currentTimeMillis() + ttlMillis));
    }

    public synchronized V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null) {
            return null;
        }
        if (entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        return entry.getValue();
    }

    private static class CacheEntry<V> {
        private final V value;
        private final long expiryTime;

        public CacheEntry(V value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }

        public V getValue() {
            return value;
        }
    }
}
```

### Life Analogy
Think of a small refrigerator in an office. It only holds 10 lunchboxes (capacity constraint). If you put a new lunchbox in and it's full, you throw out the lunchbox that hasn't been touched in the longest time (LRU). However, you also have a rule: any food older than 3 days goes in the trash, regardless of how much space is left (TTL). You check the date every time you reach in for a snack (lazy eviction).

### Key Points
- `LinkedHashMap(capacity, loadFactor, true)` is the standard way to implement LRU in Java.
- Overriding `removeEldestEntry` allows intercepting the eviction logic.
- TTL requires wrapping the cache value with an expiration timestamp and performing lazy checks on read operations.
