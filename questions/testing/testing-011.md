---
id: testing-011
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["JUnit 5"]
---

# JUnit 5 @ParameterizedTest

What is the purpose of `@ParameterizedTest` in JUnit 5?

---ANSWER---

`@ParameterizedTest` allows a test to run multiple times with different arguments. It helps reduce code duplication when testing the same logic with various inputs and expected outputs. You must supply a source of arguments, like `@ValueSource`, `@CsvSource`, or `@MethodSource`.

### Life Analogy
It's like a teacher giving the same math quiz format to 5 different students with different numbers to prevent cheating, but grading them all with the same rubric.

### Key Points
- Runs the same test method multiple times.
- Different inputs per run.
- Reduces boilerplate code.
