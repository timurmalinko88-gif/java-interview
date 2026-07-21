---
id: stream-043
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["Core Java", "Stream API"]
tags: [oop, spring-core, stream-api, memory, collections, spring-data]
---

# distinct() and Object Identity
Review the following code. Will the stream output 2 elements or 3 elements? Why?

```java
class User {
    int id;
    public User(int id) { this.id = id; }
}

List<User> users = Arrays.asList(new User(1), new User(2), new User(1));
long uniqueCount = users.stream().distinct().count();
System.out.println(uniqueCount);
```

---ANSWER---

The output will be **3**, not 2. The `distinct()` operation fails to filter out the second `User(1)`.

**Reason:**
The `distinct()` intermediate operation relies entirely on the `equals()` and `hashCode()` methods of the objects in the stream to determine if two elements are duplicates. 

Because the `User` class in the snippet does not override `equals()` and `hashCode()`, it inherits the default implementations from `java.lang.Object`. The default `equals()` method only checks for *reference equality* (memory address), not logical equality. Since the code creates three distinct instances using the `new` keyword, they all have different memory addresses, and `distinct()` considers all three of them to be unique.

**Fix:**
To make `distinct()` work correctly based on the `id`, you must override `equals()` and `hashCode()` in the `User` class:
```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return id == user.id;
}

@Override
public int hashCode() {
    return Objects.hash(id);
}
```

### Life Analogy
Imagine two identical twins wearing the exact same clothes standing in a room. 
If you don't teach the bouncer (`distinct`) how to logically compare their faces (`equals`), the bouncer just looks at their physical coordinates in the room (memory address) and says, "Well, one is standing on the left and one is standing on the right, so they must be two completely different people."

### Key Points
- `distinct()` uses `equals()` and `hashCode()` to identify duplicates.
- If you use custom objects in a stream, you MUST override these methods for `distinct()` to work properly.
- Without overridden methods, it falls back to memory reference equality.
