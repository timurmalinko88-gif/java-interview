---
id: live-007
path: questions/live-coding/live-007.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Refactoring nested if-else to Pattern Matching & Optional
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

You have legacy code that extracts nested data using multiple null-checks and instanceof checks. It is hard to read.

**Legacy Code:**

```java
public class Parser {
    public String extractZipCode(Object payload) {
        if (payload != null) {
            if (payload instanceof User) {
                User u = (User) payload;
                if (u.getAddress() != null) {
                    if (u.getAddress().getZipCode() != null) {
                        return u.getAddress().getZipCode();
                    }
                }
            }
        }
        return "UNKNOWN";
    }
}
```

### Challenge
Refactor this code using modern Java features (Java 17+), such as Pattern Matching for `instanceof` and `Optional`.

---

### Solution

**Explanation:**
Deeply nested null checks are a classic anti-pattern that can be solved with `Optional`. Also, the explicit cast after `instanceof` can be replaced with Pattern Matching for `instanceof` introduced in Java 16.

**Refactored Code:**

```java
import java.util.Optional;

public class Parser {
    public String extractZipCode(Object payload) {
        if (payload instanceof User u) {
            return Optional.ofNullable(u.getAddress())
                           .map(Address::getZipCode)
                           .orElse("UNKNOWN");
        }
        return "UNKNOWN";
    }
}
```

*Note: In newer Java versions (21+), Record Patterns could simplify this even further if `User` and `Address` were records.*
