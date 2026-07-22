---
id: patterns-022
topic: Patterns
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# Template Method vs Strategy Pattern
Explain the Template Method pattern. How does it differ from the Strategy pattern in terms of implementation mechanisms?

---ANSWER---

The Template Method is a behavioral pattern that defines the skeleton of an algorithm in a superclass but lets subclasses override specific steps of the algorithm without changing its structure.

**Implementation Difference:**
- **Template Method uses Inheritance**: It relies on an abstract base class that implements the template method (often marked `final` in Java) and leaves abstract placeholder methods for subclasses to implement. It modifies behavior at the class level.
- **Strategy uses Composition**: It relies on an interface and delegates the entire algorithm to a separate object. It modifies behavior at the object level at runtime.

### Life Analogy
**Template Method**: Building a house. The architect defines the template (foundation, walls, roof). You can choose wood or brick for the walls (overriding a step), but you can't build the roof before the foundation.
**Strategy**: Choosing a builder. You can hire Bob's Construction or Alice's Builders to build the whole house however they see fit.

### Key Points
- Template Method = Inheritance (skeleton algorithm).
- Strategy = Composition (interchangeable algorithms).
- Template Method controls the overall flow; subclasses fill in details.
