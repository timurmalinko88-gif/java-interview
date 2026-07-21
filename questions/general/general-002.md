---
id: general-002
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["OOP", "Interfaces"]
---

# What is the difference between an abstract class and an interface in Java?

List the key differences and when to use each.

---ANSWER---

### Key Differences:

1. **Multiple Inheritance:** A class can implement multiple interfaces (`implements A, B`), but can extend only one abstract class (`extends SuperClass`).
2. **State & Fields:** An abstract class can have instance variables and maintain internal state. Interfaces cannot hold instance state; any fields in an interface are implicitly `public static final` (constants).
3. **Constructors:** Abstract classes can have constructors (used to initialize state when subclasses are instantiated). Interfaces cannot have constructors.
4. **Method Access Modifiers:** Abstract class methods can have any visibility (`private`, `protected`, `package-private`, `public`). Interface methods are implicitly `public` by default (though `private` helper methods are allowed since Java 9).
5. **Design Intent:**
   - **Abstract Class:** Defines a tight **"IS-A"** relationship for a shared blueprint across closely related classes.
   - **Interface:** Defines a loose **"CAN-DO"** capability contract that can be shared across unrelated classes.

### Life Analogy
An abstract class is like the blueprint for a **Vehicle** — it defines core physical characteristics like an engine and chassis that all land vehicles share. An interface is like a **Flyable** contract — both an Airplane and a Superhero can fly, even though they share no common vehicle lineage.

### Key Points
- Abstract classes model state and identity (`IS-A`); interfaces model behavior contracts (`CAN-DO`).
- A class can implement multiple interfaces, but extend only one abstract class.
- Interfaces cannot have instance fields or constructors.

