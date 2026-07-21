---
id: general-018
topic: General
difficulty: Middle
format: Open Answer
time: 10
frequency: 90%
source: Custom
prerequisites: ["Core Java", "Basics"]
---

# What are the differences between an Abstract Class and an Interface in modern Java (Java 8+)?
Since Java 8 introduced default methods in interfaces, the line between abstract classes and interfaces has blurred. What are the key remaining differences?

---ANSWER---

Historically, interfaces could only contain abstract methods and constants, while abstract classes could hold state and concrete methods. Since Java 8, interfaces can contain `default` and `static` methods (and `private` methods since Java 9), but distinct differences remain:

**1. State (Instance Variables):**
- **Abstract Class:** Can have instance variables of any access modifier (private, protected, etc.). It can maintain state.
- **Interface:** Cannot have instance variables. Any fields declared are implicitly `public static final` (constants). It cannot maintain state.

**2. Constructors:**
- **Abstract Class:** Can have constructors, which are called when a concrete subclass is instantiated.
- **Interface:** Cannot have constructors.

**3. Inheritance and Multiple Inheritance:**
- **Abstract Class:** A class can extend only one abstract class (single inheritance).
- **Interface:** A class can implement multiple interfaces, providing a form of multiple inheritance of type and behavior.

**4. Access Modifiers:**
- **Abstract Class:** Methods and fields can have any access modifier (public, protected, private, default).
- **Interface:** Abstract methods are implicitly `public`. (Though private helper methods for default methods are now allowed).

**When to use which?**
Use an **abstract class** when subclasses share state or when you are creating a closely related family of objects. Use an **interface** to define a contract for loosely related objects and when you need multiple inheritance.

### Life Analogy
An **Abstract Class** is like a half-built house template; it has a foundation, some walls, and plumbing (state and common methods), but you have to finish it. An **Interface** is like a blueprint or a set of building codes; it tells you exactly what rules the building must follow, and you can combine multiple building codes (commercial, residential), but it doesn't provide any physical materials itself.

### Key Points
- Interfaces cannot hold state (instance variables) or have constructors.
- Abstract classes support single inheritance; interfaces support multiple implementation.
- Interfaces only allow `public static final` constants.
- Default methods in interfaces provide behavior but do not change the inability to hold state.
