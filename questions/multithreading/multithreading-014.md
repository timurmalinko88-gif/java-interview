---
id: multithreading-014
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "Runnable", "Callable"]
---

# `Runnable` vs `Callable`
What is the difference between the `Runnable` and `Callable` interfaces in Java?

---ANSWER---

Both `Runnable` and `Callable` are functional interfaces used to define tasks that can be executed concurrently by a thread or an `ExecutorService`. The main differences are:

1. **Return Value**: 
   - `Runnable` has a `run()` method that returns `void`. It cannot return a result.
   - `Callable` has a `call()` method that returns a generic type `V`. It allows you to return a result from the task.

2. **Exception Handling**:
   - `Runnable.run()` cannot throw any checked exceptions. If an exception occurs, it must be handled internally (e.g., via try-catch).
   - `Callable.call()` is declared to throw `Exception`. It can throw checked exceptions, which will be wrapped and thrown when retrieving the result.

3. **Execution Context**:
   - `Runnable` can be executed by passing it to a `Thread` constructor or submitting it to an `ExecutorService`.
   - `Callable` can only be executed by submitting it to an `ExecutorService` (which returns a `Future` object to track the result).

### Life Analogy
`Runnable` is like asking someone to wash the dishes—they do the task, but you don't expect them to hand you anything back when they finish. `Callable` is like asking someone to go to the store to buy milk—they do the task, and you expect them to return and hand you the milk (or tell you if they crashed the car on the way, throwing an exception).

### Key Points
- `Callable` returns a result; `Runnable` returns `void`.
- `Callable` can throw checked exceptions; `Runnable` cannot.
- `Callable` is usually used with `ExecutorService` and returns a `Future`.
