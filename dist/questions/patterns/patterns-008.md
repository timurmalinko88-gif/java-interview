---
id: patterns-008
topic: Patterns
difficulty: Senior
format: System Design
time: 10
frequency: 50%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# Bridge Pattern vs Adapter Pattern
Explain the Bridge pattern. How does it differ conceptually from the Adapter pattern, even though their structures can look somewhat similar?

---ANSWER---

The Bridge pattern is a structural pattern that lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently.

**Conceptual Difference:**
- **Adapter** makes things work AFTER they're designed. It resolves incompatibilities between existing interfaces. It's often a retroactive fix.
- **Bridge** makes them work BEFORE they're designed. It's an upfront design decision to let abstractions and implementations vary independently. 

For example, if you have `Shape` (Circle, Square) and `Color` (Red, Blue), instead of creating `RedCircle`, `BlueCircle`, `RedSquare`, etc., you create a `Shape` hierarchy that holds a reference to a `Color` interface.

### Life Analogy
A universal TV remote (Abstraction) and different TV brands (Implementation). The remote's buttons are the abstraction. The actual infrared signals sent to Sony or Samsung are the implementations. You can change the remote's design or add new TV brands independently.

### Key Points
- Separates abstraction from implementation.
- Solves the "Cartesian product" class explosion problem.
- Designed upfront, unlike Adapter which is applied retroactively.
