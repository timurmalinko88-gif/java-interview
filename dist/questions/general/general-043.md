---
id: general-043
topic: General
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Exceptions", "Core Java"]
tags: ['exceptions']
---

# Try-with-Resources and AutoCloseable
Review the following code. How can it be improved using modern Java features introduced in Java 7?

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileReaderApp {
    public String readFirstLine(String path) throws IOException {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(path));
            return br.readLine();
        } finally {
            if (br != null) {
                br.close();
            }
        }
    }
}
```

---ANSWER---

The code can be improved using the **try-with-resources** statement introduced in Java 7. This feature automatically closes resources when the `try` block exits, eliminating the need for the verbose `finally` block.

**Improved Code:**
```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileReaderApp {
    public String readFirstLine(String path) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            return br.readLine();
        }
    }
}
```

Any resource declared in the parentheses of a `try-with-resources` block must implement the `java.lang.AutoCloseable` or `java.io.Closeable` interface. The JVM ensures that the `close()` method is invoked automatically, even if an exception is thrown inside the `try` block.

### Life Analogy
Using a standard `finally` block is like unlocking a door, going inside, doing your work, and then having to consciously remember to lock the door behind you every time you leave. Try-with-resources is like a hotel room door; it automatically locks itself behind you the moment you walk out, ensuring you never accidentally leave it open.

### Key Points
- Try-with-resources reduces boilerplate code and prevents resource leaks.
- Replaces the need for explicit `finally` blocks for closing resources.
- The resource must implement the `AutoCloseable` interface.
