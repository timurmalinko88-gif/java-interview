---
id: live-001
path: questions/live-coding/live-001.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Memory Leak in HashMap (bad hashCode)
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Memory Leak in HashMap (bad hashCode)
We have a caching system that stores some user data using a custom `UserKey` object as the key in a `HashMap`. However, the application is experiencing an OutOfMemoryError (OOME) over time, even though we think we are replacing existing keys when updating values.

Can you identify the memory leak in the provided code and fix it?

---ANSWER---

The memory leak occurs because the `UserKey` class overrides `equals()` but fails to override `hashCode()`. In Java, a `HashMap` uses the `hashCode()` method to determine which bucket to place the key-value pair in. If `hashCode()` is not overridden, the default implementation from the `Object` class is used, which typically returns different memory addresses for different object instances.

Because every new instance of `UserKey` returns a different hash code, the `HashMap` treats them as completely distinct keys, even if their internal values (e.g., id) are identical. Instead of replacing the existing entry, a new entry is added to the map every time. This causes the map to grow indefinitely, eventually leading to a memory leak and an OutOfMemoryError.

To fix this, we must always override `hashCode()` whenever we override `equals()`. The `hashCode()` should use the same fields that are used in the `equals()` method to ensure that two equal objects produce the same hash code.

### Examples
```java
// BUGGY CODE:
class UserKey {
    private String id;

    public UserKey(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserKey userKey = (UserKey) o;
        return Objects.equals(id, userKey.id);
    }
    // Missing hashCode()!
}

// REFACTORED CODE:
class UserKey {
    private String id;

    public UserKey(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserKey userKey = (UserKey) o;
        return Objects.equals(id, userKey.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### Life Analogy
Imagine a library where the `equals()` method is the title of a book, and `hashCode()` is the library shelf number. If you have two identical copies of "Java Concurrency in Practice" but you assign them random shelf numbers every time they arrive (because of a missing `hashCode()`), you will never find the existing copy to replace it. Instead, you'll just keep adding more copies to random shelves until the library runs out of space.

### Key Points
- Always override `hashCode()` when overriding `equals()`.
- Equal objects must have equal hash codes, as defined by the general contract of `Object`.
- Failure to implement `hashCode()` properly leads to severe memory leaks when custom objects are used as keys in hash-based collections like `HashMap` or `HashSet`.
