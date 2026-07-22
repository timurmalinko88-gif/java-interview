---
id: general-035
topic: General
difficulty: Junior
format: Code Review
time: 5
frequency: 90%
source: Custom
prerequisites: ["Exceptions", "Core Java"]
tags: [oop, spring-core, multithreading, exceptions]
---

# Checked vs Unchecked Exceptions
Review the following code snippet. What is wrong with it, and how would you fix it?

```java
import java.io.File;
import java.io.FileReader;

public class FileReaderService {
    public void readFile(String filePath) {
        File file = new File(filePath);
        FileReader fr = new FileReader(file);
        System.out.println("File opened successfully.");
    }
}
```

---ANSWER---

The code will not compile because the `FileReader` constructor throws a `FileNotFoundException`, which is a **checked exception**. Java requires that all checked exceptions be either caught using a `try-catch` block or declared in the method signature using the `throws` keyword.

Here is a corrected version catching the exception:

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class FileReaderService {
    public void readFile(String filePath) {
        try {
            File file = new File(filePath);
            FileReader fr = new FileReader(file);
            System.out.println("File opened successfully.");
        } catch (FileNotFoundException e) {
            System.err.println("File not found: " + e.getMessage());
        }
    }
}
```

### Life Analogy
Checked exceptions are like requiring a permit before you can build a house. The system (compiler) forces you to acknowledge the requirement and handle it beforehand. Unchecked exceptions are like accidentally hitting a water pipe while digging; you didn't plan for it, it just happens at runtime (like `NullPointerException`).

### Key Points
- Checked Exceptions inherit from `Exception` (but not `RuntimeException`) and must be handled at compile time.
- Unchecked Exceptions inherit from `RuntimeException` and do not require explicit handling.
- Use checked exceptions for recoverable errors and unchecked for programming mistakes.
