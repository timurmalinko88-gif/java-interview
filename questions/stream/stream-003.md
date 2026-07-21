---
id: stream-003
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Core Java"]
---

# How do Lambdas relate to Functional Interfaces?
Explain what a Functional Interface is in Java and how lambda expressions are related to them.

---ANSWER---

A **Functional Interface** is an interface that contains exactly **one abstract method** (SAM - Single Abstract Method). It can optionally contain default or static methods, but the number of abstract methods must be strictly one. They are often annotated with `@FunctionalInterface` to allow the compiler to enforce this rule.
Examples in standard Java include `Runnable`, `Callable`, `Comparator`, and Java 8's `Predicate`, `Function`, `Consumer`, and `Supplier`.

**Lambda expressions** (`(args) -> body`) are simply concise syntax for creating an anonymous instance of a functional interface. Since there is only one abstract method to implement, the Java compiler can automatically infer that the lambda expression is the implementation of that specific method.

Essentially, a lambda expression provides the implementation for the single abstract method of a functional interface.

Example:
```java
// Traditional Anonymous Inner Class
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// Lambda Expression
Runnable r2 = () -> System.out.println("Hello");
```

### Life Analogy
Think of a Functional Interface as a job posting for a highly specific role that requires only one exact skill, like "Door Greeter" (who only says "Welcome!"). 
A Lambda expression is like hiring someone instantly on the spot because they perfectly fit that exact single requirement, without needing them to fill out a 10-page resume (an anonymous inner class).

### Key Points
- Functional Interfaces have exactly one abstract method.
- The `@FunctionalInterface` annotation is optional but recommended.
- Lambdas provide a clear and concise way to represent one-method interface implementations.
- The types of the lambda parameters are inferred from the interface's method signature.
