---
id: stream-017
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 60%
source: Custom
prerequisites: ["Lambdas"]
tags: ['stream-api']
---

# Custom Functional Interfaces
How would you define a custom functional interface in Java? Review the following code snippet and explain if it is a valid functional interface.

```java
@FunctionalInterface
public interface StringProcessor {
    String process(String input);
    
    default void printLength(String input) {
        System.out.println(input.length());
    }
    
    static void printGreeting() {
        System.out.println("Hello from Processor!");
    }
    
    String toString();
}
```

---ANSWER---

Yes, the provided code snippet is a perfectly valid Functional Interface.

To create a custom functional interface, you define an interface with **exactly one abstract method**. 

Here is why `StringProcessor` is valid despite having four methods listed:
1. `process(String)` is the single abstract method (SAM) required.
2. `printLength(String)` is a `default` method (with an implementation), so it doesn't count against the SAM limit.
3. `printGreeting()` is a `static` method, so it also doesn't count.
4. `toString()` is a method matching the public signature of `java.lang.Object`. The Java compiler implicitly ignores abstract methods overriding `Object` methods when counting for the SAM rule.

The `@FunctionalInterface` annotation is optional but highly recommended. It serves as compiler enforcement (similar to `@Override`). If you accidentally add a second abstract method, the compiler will throw an error.

### Life Analogy
Think of a Functional Interface as a Swiss Army Knife where the primary tool is a blade (the single abstract method). It might also have a built-in compass (static method) and a ruler printed on the side (default method), but fundamentally, its main identity is defined by that one primary blade.

### Key Points
- A Functional Interface has exactly one non-Object abstract method.
- It can contain any number of default and static methods.
- Methods matching `java.lang.Object` (like `equals`, `hashCode`, `toString`) do not count.
- The `@FunctionalInterface` annotation provides compiler-level validation.
