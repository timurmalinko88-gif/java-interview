---
id: general-025
topic: General
difficulty: Middle
format: Code Review
time: 10
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Exceptions"]
tags: ['exceptions']
---

# Checked vs Unchecked Exceptions

Review the following code. What is wrong with it, and how would you improve the exception handling?

```java
public class DataProcessor {
    public void processFile(String path) {
        try {
            FileReader reader = new FileReader(path);
            // read file...
        } catch (Exception e) {
            System.out.println("Error occurred");
            throw new RuntimeException(e);
        }
    }
}
```

---ANSWER---

The code has several issues related to exception handling:

1. **Catching `Exception`:** Catching the generic `Exception` is a bad practice. It catches both checked (`IOException`, `FileNotFoundException`) and unchecked (`NullPointerException`) exceptions. It hides bugs because unexpected runtime exceptions are handled the same way as predictable I/O errors.
2. **Resource Leak:** The `FileReader` is never closed. If an exception occurs, or even if it completes successfully, the file handle remains open. A `try-with-resources` block or a `finally` block must be used.
3. **Poor Logging:** `System.out.println` is not a proper logging mechanism. It lacks context, timestamp, and severity levels. A proper logger (like SLF4J/Logback) should be used.
4. **Exception Wrapping:** Wrapping a checked exception into a `RuntimeException` is sometimes acceptable to avoid cluttering method signatures, but doing it indiscriminately for all exceptions (including already unchecked ones) is a poor design choice.

**Improved Code:**
```java
public class DataProcessor {
    private static final Logger logger = LoggerFactory.getLogger(DataProcessor.class);

    public void processFile(String path) {
        try (FileReader reader = new FileReader(path)) {
            // read file...
        } catch (FileNotFoundException e) {
            logger.error("File not found at path: {}", path, e);
            throw new DataProcessingException("File not found", e); 
        } catch (IOException e) {
            logger.error("Error reading file: {}", path, e);
            throw new DataProcessingException("Error reading data", e);
        }
    }
}
```

### Life Analogy
Imagine a hospital reception. Catching `Exception` is like sending everyone who walks in (whether they have a common cold, a broken leg, or are just asking for directions) to the emergency surgery room. You should direct specific problems to specific departments for proper handling.

### Key Points
- Avoid catching the generic `Exception` class.
- Always clean up resources using `try-with-resources` or `finally`.
- Use proper logging frameworks instead of `System.out`.
- Throw specific, meaningful exceptions rather than generic `RuntimeException`s.
