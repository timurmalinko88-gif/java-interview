---
id: live-013
path: questions/live-coding/live-013.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Recursive JSON parsing algorithm
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

Given a nested JSON-like Map string structure parsed into `Map<String, Object>`, write a recursive function to find the value of a deeply nested key.

**Example Input:**
```java
Map<String, Object> data = Map.of(
    "level1", Map.of(
        "level2", Map.of(
            "targetKey", "foundMe!"
        )
    )
);
```

### Challenge
Implement `public static Object findKey(Map<String, Object> map, String keyToFind)` which traverses the map recursively and returns the object associated with the key. Return null if not found.

---

### Solution

**Explanation:**
We need to iterate over the entries of the map. If the key matches `keyToFind`, we return the value. If the value is itself a `Map`, we recursively call the method.

**Implementation:**

```java
import java.util.Map;

public class JsonUtils {

    @SuppressWarnings("unchecked")
    public static Object findKey(Map<String, Object> map, String keyToFind) {
        if (map == null || map.isEmpty()) {
            return null;
        }

        // 1. Check if the current map contains the key directly
        if (map.containsKey(keyToFind)) {
            return map.get(keyToFind);
        }

        // 2. Iterate and recurse on nested Maps
        for (Object value : map.values()) {
            if (value instanceof Map) {
                Object result = findKey((Map<String, Object>) value, keyToFind);
                if (result != null) {
                    return result; // Key found in deep nested map
                }
            }
        }

        return null; // Key not found anywhere
    }
}
```
