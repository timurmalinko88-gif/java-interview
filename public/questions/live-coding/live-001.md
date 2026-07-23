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

### Problem

You are given the following code. The application uses a `Person` object as a key in a `HashMap`. However, over time, the application runs out of memory.

**Buggy Code:**

```java
import java.util.HashMap;
import java.util.Map;

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && name.equals(person.name);
    }
    
    // Missing hashCode() method!
}

public class MemoryLeakDemo {
    public static void main(String[] args) {
        Map<Person, String> map = new HashMap<>();
        while (true) {
            map.put(new Person("John", 30), "Developer");
        }
    }
}
```

### Challenge
Identify the bug and refactor the code to fix the memory leak.

---

### Solution

**Explanation:**
The `Person` class overrides `equals()` but fails to override `hashCode()`. In Java, if two objects are equal according to the `equals(Object)` method, then calling the `hashCode` method on each of the two objects must produce the same integer result. 
When `hashCode()` is missing, `HashMap` uses the default `Object.hashCode()` which returns a different hash for each new instance. Thus, every new `Person("John", 30)` is placed in a different bucket or treated as a distinct key, causing the map to grow indefinitely and eventually throw an `OutOfMemoryError`.

**Refactored Code:**

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}
```
