---
id: stream-040
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Lambdas"]
tags: [spring-core, oop, stream-api, memory]
---

# Predicate Composition
Suppose you have two predicates: `Predicate<String> isLong = s -> s.length() > 5;` and `Predicate<String> isUppercase = s -> s.toUpperCase().equals(s);`. How can you combine them to filter a stream of strings that are BOTH long AND uppercase, without writing a new lambda from scratch?

---ANSWER---

You can combine predicates using the default methods provided by the `Predicate` functional interface: `and()`, `or()`, and `negate()`. 

This is known as **Predicate Composition**.

To filter for strings that are BOTH long and uppercase, you use the `and()` method to chain them together:

```java
Predicate<String> isLong = s -> s.length() > 5;
Predicate<String> isUppercase = s -> s.toUpperCase().equals(s);

// Combine them
Predicate<String> isLongAndUpper = isLong.and(isUppercase);

stream.filter(isLongAndUpper).forEach(System.out::println);
```

You could also do it inline:
```java
stream.filter(isLong.and(isUppercase)).forEach(System.out::println);
```

Other combinations:
- Logical OR: `isLong.or(isUppercase)`
- Logical NOT: `isLong.negate()`

### Life Analogy
Predicate composition is like stacking physical filters on a camera lens. You have a polarizing filter (Predicate A) and a red-tint filter (Predicate B). Instead of inventing a brand new piece of glass that does both, you just screw the polarizing filter onto the red filter (`A.and(B)`) and attach the combined stack to your camera (the Stream).

### Key Points
- `Predicate` provides default methods `and()`, `or()`, and `negate()` for logical composition.
- Composition promotes reusability of small, single-purpose predicates.
- They exhibit short-circuiting behavior (e.g., in `A.and(B)`, if A is false, B is never evaluated).
