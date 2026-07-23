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

### Problem

Implement an LRU (Least Recently Used) cache in Java with a maximum capacity and a Time-To-Live (TTL) expiration for each entry.

**Skeleton Code:**

```java
public class LRUCacheWithTTL<K, V> {
    public LRUCacheWithTTL(int capacity, long ttlMillis) {
        // ...
    }
    
    public void put(K key, V value) {
        // ...
    }
    
    public V get(K key) {
        // ...
        return null;
    }
}
```

### Challenge
Complete the implementation ensuring O(1) time complexity for `get` and `put` operations (ignoring cleanup overhead).

---

### Solution

**Explanation:**
Java's `LinkedHashMap` provides an excellent foundation for an LRU cache if you override the `removeEldestEntry` method. We can pair this with a wrapper object that stores the insertion time to enforce the TTL. 

**Implementation:**

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCacheWithTTL<K, V> {
    
    private static class CacheEntry<V> {
        V value;
        long expiryTime;
        
        CacheEntry(V value, long ttlMillis) {
            this.value = value;
            this.expiryTime = System.currentTimeMillis() + ttlMillis;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    private final Map<K, CacheEntry<V>> cache;
    private final long ttlMillis;

    public LRUCacheWithTTL(int capacity, long ttlMillis) {
        this.ttlMillis = ttlMillis;
        // true for access-order (LRU)
        this.cache = new LinkedHashMap<K, CacheEntry<V>>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, CacheEntry<V>> eldest) {
                return size() > capacity;
            }
        };
    }

    public synchronized void put(K key, V value) {
        cache.put(key, new CacheEntry<>(value, ttlMillis));
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
        return entry.value;
    }
}
```
