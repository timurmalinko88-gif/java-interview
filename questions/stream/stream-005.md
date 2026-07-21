---
id: stream-005
topic: Stream API
difficulty: Junior
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["Lambdas"]
---

# Method References Syntax
Review the following code snippet. Can the lambda expressions be replaced by method references? If so, how?

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 1. Static method
names.forEach(name -> System.out.println(name));

// 2. Instance method of an arbitrary object of a particular type
names.stream().map(name -> name.toUpperCase());

// 3. Constructor
Supplier<List<String>> listSupplier = () -> new ArrayList<>();
```

---ANSWER---

Yes, all three lambda expressions can be elegantly replaced by Method References. Method references provide a more compact and readable shorthand when a lambda expression does nothing but call an existing method.

Here is the refactored code:

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 1. Reference to a static method / instance method of an existing object
names.forEach(System.out::println);

// 2. Reference to an instance method of an arbitrary object of a particular type
names.stream().map(String::toUpperCase);

// 3. Reference to a constructor
Supplier<List<String>> listSupplier = ArrayList::new;
```

Types of method references:
1. **Static Method Reference**: `ClassName::staticMethodName`
2. **Instance Method of a particular object**: `instanceRef::methodName` (e.g., `System.out::println`)
3. **Instance Method of an arbitrary object of a given type**: `ClassName::methodName` (e.g., `String::toUpperCase`)
4. **Constructor Reference**: `ClassName::new`

### Life Analogy
If a lambda expression is like writing down a full sentence of instructions for a courier: "Take this package and give it to the manager," a Method Reference is like just handing the package over and pointing directly at the manager. You are pointing directly to the method that should handle the data instead of describing the handling process.

### Key Points
- Method references (`::`) are shorthand for lambdas that only invoke a single method.
- They make code even cleaner and more readable.
- There are four main types of method references: static, specific instance, arbitrary instance, and constructor.
