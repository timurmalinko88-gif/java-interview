---
id: stream-036
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Lambdas"]
tags: ['stream-api']
---

# UnaryOperator and BinaryOperator
What are `UnaryOperator` and `BinaryOperator` in the `java.util.function` package? How do they relate to `Function` and `BiFunction`?

---ANSWER---

Both `UnaryOperator` and `BinaryOperator` are specialized functional interfaces designed for cases where the input types and the return type are all exactly the same.

**`UnaryOperator<T>`:**
- Represents an operation on a single operand that produces a result of the same type as its operand.
- It is a direct sub-interface of `Function<T, T>`.
- Example use case: `Stream.iterate(seed, UnaryOperator)`, or replacing elements in a List (`list.replaceAll(String::toUpperCase)`).

**`BinaryOperator<T>`:**
- Represents an operation upon two operands of the same type, producing a result of the same type as the operands.
- It is a direct sub-interface of `BiFunction<T, T, T>`.
- Example use case: The accumulator and combiner functions in `Stream.reduce(BinaryOperator)` (e.g., `(a, b) -> a + b`).

Using these operators makes the code cleaner because you only have to specify the generic type `T` once, instead of repeating it two or three times.

### Life Analogy
If `Function` is a generic translator that turns an English word into a Spanish word, `UnaryOperator` is an editor that takes an English word and returns an improved English word (input and output are the same language). 
If `BiFunction` takes a car and a driver to produce a lap time, `BinaryOperator` takes two pieces of clay and smooshes them together to produce one bigger piece of clay (all three things are clay).

### Key Points
- `UnaryOperator<T>` extends `Function<T, T>`.
- `BinaryOperator<T>` extends `BiFunction<T, T, T>`.
- Used when inputs and outputs are of the same type.
