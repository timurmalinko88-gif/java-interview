---
id: collections-051
topic: Collections
difficulty: Middle
format: Code Review
time: 8
frequency: 85%
source: Custom
prerequisites: ["Collections", "HashSet", "HashMap", "equals and hashCode"]
tags: ['core-middle', 'collections', 'hashcode']
---

# equals and hashCode Contract with Mutable Keys in HashSet

Spot the subtle bug in the following Java snippet. Why does `set.contains(person)` return `false` even though the object was added to the `HashSet` and was never removed?

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void setAge(int age) { this.age = age; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person p)) return false;
        return age == p.age && Objects.equals(name, p.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

public class Main {
    public static void main(String[] args) {
        Set<Person> set = new HashSet<>();
        Person person = new Person("Alice", 25);
        set.add(person);

        // Mutating field used in hashCode() after insertion:
        person.setAge(26);

        System.out.println(set.contains(person)); // Prints: false!
        System.out.println(set.size());             // Prints: 1
    }
}
```

---ANSWER---

### Root Cause: Bucket Mismatch after Hash Mutation

1. **How `HashSet.add()` works:**
   - When `person` with `age = 25` is added, `person.hashCode()` is computed (e.g. hash `12345`).
   - The object is placed into bucket index: `index = (n - 1) & hash` (say, bucket #4).
2. **What happens on mutation:**
   - Calling `person.setAge(26)` changes the internal fields used by `hashCode()`.
   - The object's new hash code becomes, say, `67890`.
3. **Why `set.contains(person)` fails:**
   - `contains()` re-evaluates `person.hashCode()`, which now points to bucket #9.
   - Bucket #9 is completely empty!
   - `HashSet` never checks bucket #4, so it concludes the object is not in the set and returns `false`.
4. **Consequences:**
   - You can neither find the object nor remove it via `set.remove(person)`.
   - It becomes an un-removable zombie object, causing silent memory leaks in long-running services.

### Best Practices to Prevent This Bug
1. **Immutable Keys:** Whenever possible, use immutable objects (Java `record` or classes with `final` fields) as keys in `HashMap` or elements in `HashSet`.
2. **Stable Hash Identity:** If an entity must be mutable, compute `equals` and `hashCode` using only a **business key** or immutable identifier (such as `id` or UUID), never mutable business fields like `age` or `status`.

### Key Takeaways
- Modifying fields that participate in `hashCode()` after inserting an element into a hash-based collection breaks the bucket lookup.
- `contains()` and `remove()` will fail even though the object resides in the collection.
- Always prefer immutable objects as `Set` elements and `Map` keys.\n