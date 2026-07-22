---
id: general-022
topic: General
difficulty: Senior
format: Code Review
time: 10
frequency: 40%
source: Custom
prerequisites: ["Core Java", "Inheritance"]
tags: [spring-core, oop, memory]
---

# Can you explain the concept of covariant return types?
Review the concept of covariant return types. Will the following code compile? If so, why?

```java
class Animal {
    public Animal reproduce() {
        return new Animal();
    }
}

class Dog extends Animal {
    @Override
    public Dog reproduce() {
        return new Dog();
    }
}
```

---ANSWER---

Yes, the code will compile perfectly. This is an example of a **covariant return type**.

**Explanation:**
Prior to Java 5, when overriding a method, the return type of the overriding method in the subclass had to perfectly match the return type of the overridden method in the superclass.

Java 5 introduced covariant return types. This feature allows an overriding method to return a more specific type (a subtype) than the method it overrides.

In the example:
1. `Animal.reproduce()` returns an `Animal`.
2. `Dog` extends `Animal`.
3. `Dog.reproduce()` overrides the method, but changes the return type from `Animal` to `Dog`.

Because a `Dog` **IS-A** `Animal`, returning a `Dog` satisfies the contract of returning an `Animal`. This makes the code much cleaner and removes the need for explicit casting when calling the method on a `Dog` reference.

```java
Dog myDog = new Dog();
// Without covariant return types, this would require a cast:
// Dog puppy = (Dog) myDog.reproduce();
Dog puppy = myDog.reproduce(); // Clean and safe
```

### Life Analogy
If a contract (superclass) states "You must provide me a Vehicle," and you (the subclass) provide a "Bicycle" (which is a specific type of Vehicle), you have still fulfilled the contract. You are just being more specific about exactly what kind of vehicle you are providing.

### Key Points
- Introduced in Java 5.
- Allows an overridden method in a subclass to return a subtype of the superclass's method return type.
- Eliminates unnecessary casting and improves code readability.
- It relies on the IS-A relationship (inheritance).
