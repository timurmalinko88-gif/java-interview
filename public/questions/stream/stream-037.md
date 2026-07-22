---
id: stream-037
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Lambdas"]
tags: [oop, spring-core, patterns, stream-api, exceptions]
---

# Consumer vs Supplier
Explain the difference between the `Consumer` and `Supplier` functional interfaces in Java 8. Give examples of where they are used in the Stream API.

---ANSWER---

Both are fundamental functional interfaces in `java.util.function`, but they represent opposite data flows.

**`Consumer<T>`:**
- **Signature:** `void accept(T t)`
- **Role:** It takes an argument but returns nothing (produces a side-effect). It "consumes" data.
- **Stream API Usage:** Used heavily in `forEach()` and `peek()`.
- **Example:** `Consumer<String> printer = System.out::println;`

**`Supplier<T>`:**
- **Signature:** `T get()`
- **Role:** It takes no arguments but returns a result. It "supplies" or generates data.
- **Stream API Usage:** Used in `Stream.generate()`, and as the factory parameter in `collect(Supplier, BiConsumer, BiConsumer)` to create the initial accumulator container.
- **Example:** `Supplier<Double> randomizer = Math::random;`

### Life Analogy
A `Supplier` is like a vending machine: you press a button (no data provided), and it gives you a soda (returns data).
A `Consumer` is like a trash can: you throw your empty soda can into it (provide data), and it just takes it; it doesn't give you anything back.

### Key Points
- `Consumer<T>` takes input and returns `void`. Used for side effects.
- `Supplier<T>` takes no input and returns `T`. Used for generation or lazy initialization.
