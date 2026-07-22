---
id: general-006
topic: General
difficulty: Senior
format: Code Review
time: 10
frequency: 75%
source: Custom
prerequisites: ["Core Java", "Strings", "Memory Profiling"]
tags: [oop, spring-core, system-design, patterns, stream-api, memory, multithreading, collections]
---

# String Pool and Memory Optimization

Review the following code snippet. Explain what happens in memory when this code executes and how it can be optimized for memory efficiency in an application that processes millions of such strings.

```java
public class ProductParser {
    public List<String> extractCategories(List<String> rawData) {
        List<String> categories = new ArrayList<>();
        for (String data : rawData) {
            String category = new String(data.substring(0, 5));
            categories.add(category);
        }
        return categories;
    }
}
```

---ANSWER---

**Code Analysis & Memory Implications:**

1. **`new String(...)` Anti-pattern:** Using `new String(...)` explicitly forces Java to allocate a brand new String object on the heap, bypassing the String constant pool. If the dataset contains many duplicate categories (e.g., "ELEC", "BOOKS"), each occurrence creates a distinct String object, wasting heap space.
2. **`substring` behavior (Historical context):** Prior to Java 7u6, `substring` shared the underlying character array with the original String. Creating a new String was a hack to avoid memory leaks if the original string was huge. However, in modern Java, `substring` creates a new character array anyway, making `new String()` completely redundant.

**Optimization:**

The application processes millions of strings. If the number of *unique* categories is small compared to the total number of items, we should use the String pool to deduplicate them.

```java
public class ProductParser {
    public List<String> extractCategories(List<String> rawData) {
        List<String> categories = new ArrayList<>();
        for (String data : rawData) {
            // Drop 'new String', and use intern() to deduplicate
            String category = data.substring(0, 5).intern(); 
            categories.add(category);
        }
        return categories;
    }
}
```

By calling `.intern()`, we ask Java to check the String Pool. If the string "ELEC " exists, it returns the pooled reference. If not, it adds it. For millions of records with few unique categories, this drastically reduces memory footprint. Alternatively, a custom `ConcurrentHashMap` can be used as a cache if we want to avoid native String Pool overhead.

### Life Analogy
Imagine you are at a conference giving out name badges. The original code creates a brand new physical badge for every single person who belongs to "Sales", even if you already have a stack of pre-printed "Sales" badges. Calling `intern()` is like checking if you already have a "Sales" badge printed in your drawer before deciding to print a brand new one.

### Key Points
- `new String("...")` forces heap allocation and ignores the String pool.
- `substring()` no longer shares char arrays in modern Java.
- Use `String.intern()` for aggressive deduplication of strings when the number of unique strings is low compared to the total volume.
- Excessive `intern()` usage can impact performance; custom caching (e.g., Maps) is sometimes preferred.
