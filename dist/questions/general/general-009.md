---
id: general-009
topic: General
difficulty: Middle
format: Code Review
time: 10
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Object Class", "Collections"]
tags: []
---

# equals() and hashCode() Contract

Review the following class. What will happen when an instance of `Person` is used as a key in a `HashMap`? Identify the flaw and explain the contract between `equals()` and `hashCode()`.

```java
public class Person {
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
}
```

---ANSWER---

**The Flaw:**
The `Person` class overrides `equals()` but **fails to override `hashCode()`**. 

When this object is used as a key in a `HashMap`, the default `hashCode()` implementation (from the `Object` class, which typically uses the object's internal memory address) will be invoked. 
This means two logically equal `Person` objects (e.g., `new Person("Alice", 30)` and `new Person("Alice", 30)`) will likely have different hash codes. 

If you put a value into a HashMap using the first instance:
`map.put(new Person("Alice", 30), "Data");`

And try to retrieve it using a new, logically equal instance:
`map.get(new Person("Alice", 30));` // Returns null!

The Map will look in the wrong hash bucket because the hash codes differ, resulting in a failure to retrieve the data.

**The Contract:**
1. If two objects are equal according to the `equals(Object)` method, then calling the `hashCode` method on each of the two objects must produce the same integer result.
2. If two objects are unequal according to the `equals(Object)` method, it is not required that their `hashCode` values be distinct (though distinct hash codes improve hash table performance).
3. The `hashCode` must consistently return the same integer as long as the data used in `equals` is not modified.

**Fix:**
```java
@Override
public int hashCode() {
    return Objects.hash(name, age);
}
```

### Life Analogy
Think of a huge library. The `hashCode` is the section/aisle number (e.g., "Aisle 4, Shelf 2"), and `equals` is reading the actual book title to verify you have the right one. If you have two exact copies of "Moby Dick" but you assign one to Aisle 4 and the other to Aisle 9 (bad hashcode), a librarian looking for the second copy in Aisle 4 will mistakenly conclude it doesn't exist, even if they know what the cover looks like.

### Key Points
- Always override `hashCode()` when you override `equals()`.
- Equal objects MUST have the same hash code.
- Failing to do so breaks hash-based collections (`HashMap`, `HashSet`, `Hashtable`).
