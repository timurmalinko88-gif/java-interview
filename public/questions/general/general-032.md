---
id: general-032
topic: General
difficulty: Junior
format: Code Review
time: 5
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Pass by Value", "References"]
tags: [oop, spring-core, patterns, testing, memory]
---

# Pass by Value vs Pass by Reference

Review the following code. What will be the output when `main` is executed, and why?

```java
public class PassTest {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Hello");
        int num = 10;
        
        modify(sb, num);
        
        System.out.println(sb.toString() + " " + num);
    }
    
    public static void modify(StringBuilder str, int n) {
        str.append(" World");
        n = 20;
    }
}
```

---ANSWER---

The output will be:
`Hello World 10`

**Why?**
Java is strictly **pass-by-value**. However, the "value" passed depends on the type of the variable.

1. **For primitives (`int num = 10`):** The *actual value* (`10`) is copied and passed to the method `modify`. Changing `n` inside the method only changes the local copy. The original `num` in `main` remains untouched.
2. **For objects (`StringBuilder sb`):** The *value of the reference* (the memory address pointing to the object) is copied and passed. Therefore, both `sb` in `main` and `str` in `modify` point to the exact same `StringBuilder` object in the heap.
   - Calling `str.append(" World")` mutates the actual object in memory. Because `sb` points to that same object, the change is visible in `main`.
   - If the method did `str = new StringBuilder("New")`, it would just reassign the local reference copy, and `sb` in `main` would remain unaffected.

### Life Analogy
Imagine you have a remote control (reference) that operates a TV (the object). If you pass a primitive, you are photocopying a piece of paper with a number on it. If the other person changes their copy, yours stays the same. 
If you pass an object, you are giving the other person an identical copy of your remote control. If they press "Channel Up" (mutate the object), your TV changes channel. But if they smash their remote and buy a new one (reassign the reference), your remote still controls the original TV.

### Key Points
- Java is always pass-by-value.
- For primitives, the value itself is copied.
- For objects, the reference (memory address) is copied.
- Mutating an object inside a method affects the original object. Reassigning the reference does not.
