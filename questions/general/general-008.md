---
id: general-008
topic: General
difficulty: Senior
format: Open Answer
time: 8
frequency: 70%
source: Custom
prerequisites: ["Core Java", "Generics", "Type Erasure"]
tags: [oop, spring-core, stream-api, jvm, memory, collections, exceptions]
---

# Type Erasure and Heap Pollution

What is Type Erasure in Java Generics? How does it relate to the concept of "Heap Pollution," and how can you trigger Heap Pollution in Java?

---ANSWER---

**Type Erasure** is the process by which the Java compiler implements generics. To ensure backward compatibility with older Java versions (pre-Java 5), the compiler translates generic types to raw types (e.g., `List<String>` becomes just `List`). 
- It replaces all type parameters with their bounds (or `Object` if unbounded).
- It inserts type casts where necessary to preserve type safety.
- Therefore, at runtime, a `List<String>` and a `List<Integer>` are exactly the same class: `ArrayList.class`. The JVM does not know their generic type at runtime.

**Heap Pollution** occurs when a variable of a parameterized type refers to an object that is not of that parameterized type. Because of type erasure, the JVM cannot catch this at runtime during assignment. The error only manifests later as a `ClassCastException` when the element is retrieved and the implicit cast fails.

**Triggering Heap Pollution:**
Heap pollution usually happens when mixing generic types with raw types, or when using arrays of parameterized types (often with varargs).

*Example using Raw Types:*
```java
List<String> stringList = new ArrayList<>();
List rawList = stringList; // Raw type reference
rawList.add(100); // Integer added to a List meant for Strings (Heap Pollution!)

// Later...
String s = stringList.get(0); // ClassCastException here!
```

*Example using Varargs (which create underlying arrays):*
When you have a method like `public void process(List<String>... lists)`, the compiler creates an array `List[]`. If you assign this array to a generic array reference, you can insert lists of wrong types. This is why `@SafeVarargs` exists to suppress warnings when you know your varargs usage is safe.

### Life Analogy
Imagine you have a shipping box labeled "Apples Only" (Generics). At the shipping facility, an inspector (Compiler) verifies it. However, the delivery truck driver (JVM) is blind to the label (Type Erasure) and just sees a "Box." If a careless warehouse worker (Raw type code) sneaks an orange into the box after inspection, the truck driver won't notice. This is Heap Pollution. The problem only explodes when you open the box at home expecting an apple, bite into it, and realize it's an orange (`ClassCastException`).

### Key Points
- Type Erasure removes generic type information at compile-time to maintain backward compatibility.
- Generics in Java are compile-time only (for the most part).
- Heap pollution is when a generic collection contains elements of the wrong type at runtime.
- It is typically caused by mixing generics with raw types or unsafe varargs array creation.
