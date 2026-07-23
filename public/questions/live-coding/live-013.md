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

# Recursive JSON parsing algorithm
You are given a deeply nested JSON-like Map in Java (e.g., `Map<String, Object>`), where the values can be Strings, Integers, or other Maps. 
We need a method `findTargetValue(Map<String, Object> json, String targetKey)` that searches the entire tree structure for a specific key and returns its value as a String. The current iterative approach is heavily tangled with stacks and casting errors.

Can you write a clean, recursive algorithm to search the nested Map and find the value for the given key?

---ANSWER---

Navigating tree-like structures (like nested JSON objects, file systems, or DOM trees) is a classic use case for recursion. An iterative approach requires managing a stack or queue manually, which can result in verbose and error-prone code.

In a recursive approach, the function defines a base case (what to do when the current object is a simple value) and a recursive step (what to do when the object is a nested Map). 

We iterate through the keys of the current Map. If we find the `targetKey`, we return its value. If a value is itself a `Map`, we recursively call `findTargetValue` on that nested Map. If the recursive call returns a non-null value, it means the target was found deep within that branch, and we bubble that value all the way back up to the initial caller.

### Examples
```java
// IMPLEMENTATION (Recursive Search):
import java.util.Map;

public class JsonSearcher {

    /**
     * Recursively searches for the targetKey in a nested Map.
     * @return The value as a String, or null if not found.
     */
    public String findTargetValue(Map<String, Object> jsonMap, String targetKey) {
        if (jsonMap == null || targetKey == null) {
            return null;
        }

        // 1. Check current level keys
        if (jsonMap.containsKey(targetKey)) {
            return String.valueOf(jsonMap.get(targetKey));
        }

        // 2. Iterate and recurse into nested Maps
        for (Map.Entry<String, Object> entry : jsonMap.entrySet()) {
            Object value = entry.getValue();
            
            if (value instanceof Map) {
                // Safe cast because of instanceof check
                @SuppressWarnings("unchecked")
                Map<String, Object> nestedMap = (Map<String, Object>) value;
                
                // Recursive call
                String result = findTargetValue(nestedMap, targetKey);
                
                // If found in the nested map, return it immediately
                if (result != null) {
                    return result;
                }
            }
        }

        // Not found in this branch
        return null; 
    }
}
```

### Life Analogy
Imagine looking for a specific document in a filing cabinet. You open a drawer. If the document is there, you grab it (base case). If you see folders instead, you open the first folder. If it's not there, you open a folder inside that folder (recursion). You keep digging deeper into folders until you find it. Once found, you pass the document back up your arms until you're standing outside the cabinet again. 

### Key Points
- Recursion is elegant for hierarchical, tree-like data structures like JSON, XML, or file directories.
- Always establish a clear base case to prevent infinite loops (StackOverflowError).
- Check types safely using `instanceof` before casting down to recursive data structures.
