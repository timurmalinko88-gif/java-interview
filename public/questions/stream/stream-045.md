---
id: stream-045
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 90%
source: Custom
prerequisites: ["Lambdas"]
tags: ['stream-api']
---

# Effectively Final Variables
Review the following code. Why does it cause a compilation error? How can you achieve the desired outcome (summing the numbers) without errors?

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = 0;

numbers.forEach(num -> {
    sum += num; // Compilation error here
});
System.out.println(sum);
```

---ANSWER---

The code causes a compilation error: *Variable used in lambda expression should be final or effectively final.*

**Reason:**
Lambdas can capture (read) variables from their enclosing scope, but those variables must be **effectively final**—meaning their value is never reassigned after initial assignment. 
In the code, `sum += num` attempts to mutate the primitive `sum` variable from inside the lambda. Java prohibits this to prevent race conditions in concurrent executions (e.g., if this was a `parallelStream().forEach()`).

**Fixes:**

*1. The Stream Way (Best Practice):*
Use the Stream API's built-in reduction operations instead of mutating external state.
```java
int sum = numbers.stream().mapToInt(Integer::intValue).sum();
// Or using reduce: numbers.stream().reduce(0, Integer::sum);
```

*2. The Atomic Wrapper Way (If mutation is strictly required):*
If you absolutely must mutate a variable from inside a lambda, wrap it in a thread-safe, mutable container like `AtomicInteger`, or an array of size 1. The *reference* to the container remains effectively final, but its *internal state* can be changed.
```java
AtomicInteger atomicSum = new AtomicInteger(0);
numbers.forEach(num -> atomicSum.addAndGet(num));
// atomicSum.get() holds the result
```

### Life Analogy
An effectively final variable is like a sealed set of instructions given to a pilot before takeoff. The pilot can read the instructions while flying (capturing the variable), but they cannot cross out the destination and write a new one with a pen (mutating the variable). If a new destination is needed, command control must calculate it securely (using Stream reductions).

### Key Points
- Lambdas can only capture variables that are final or effectively final.
- Attempting to mutate an enclosing primitive/reference variable inside a lambda causes a compiler error.
- Use stream reductions (`reduce`, `sum`, `collect`) instead of external side-effects.
- Mutable wrappers (like `AtomicInteger`) can bypass this but are generally bad practice in functional programming.
