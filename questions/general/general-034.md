---
id: general-034
topic: General
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Generics", "Core Java"]
---

# Type Erasure in Java Generics
What is Type Erasure in Java Generics? How does it affect method overloading and runtime type checking?

---ANSWER---

Type Erasure is a process by which the Java compiler removes all type parameters and replaces them with their bounds or `Object` if the type parameter is unbounded. The compiled bytecode contains only ordinary classes, interfaces, and methods.

Because of Type Erasure:
1. **Method Overloading:** You cannot overload a method where the only difference is the type parameter of a generic type (e.g., `void print(List<String> list)` and `void print(List<Integer> list)`). The compiler will see both as `void print(List list)` and report a compilation error.
2. **Runtime Type Checking:** You cannot use `instanceof` with parameterized types (e.g., `obj instanceof List<String>` is invalid), because at runtime, the JVM does not know if the list contains Strings or Integers.

### Life Analogy
Imagine a shipping container system. When a company packs boxes (compilation time), they label one container "Books" and another "Clothes". But when the containers are loaded onto the cargo ship (runtime), the ship's manifest just lists them all generically as "Containers" without tracking what's inside each specific one.

### Key Points
- Generics are a compile-time feature in Java.
- Type Erasure ensures backward compatibility with pre-Java 5 code.
- Replaces unbounded type parameters with `Object` and bounded with the first bound class.
- Prevents runtime type checks like `instanceof` on generic types.
