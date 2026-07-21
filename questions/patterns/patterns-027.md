---
id: patterns-027
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["OOP", "SOLID", "Interfaces"]
---

# Interface Segregation Principle (ISP)
What is the Interface Segregation Principle? Give an example of a "fat" interface and how to refactor it.

---ANSWER---

The Interface Segregation Principle (ISP) is the "I" in SOLID. It states that no client should be forced to depend on methods it does not use. Large, "fat" interfaces should be split into smaller, more specific ones.

**Violation Example:**
A `MultiFunctionMachine` interface with methods `print()`, `scan()`, and `fax()`. 
If you create a `BasicPrinter` class that implements this interface, it has to provide dummy implementations (or throw `UnsupportedOperationException`) for `scan()` and `fax()`, because a basic printer only prints.

**Fix:**
Split the interface into three: `Printer`, `Scanner`, and `FaxMachine`.
The `BasicPrinter` now only implements `Printer`. An `AdvancedCopier` can implement all three if it wants to, perhaps by implementing a composite interface that inherits from the three smaller ones.

### Life Analogy
A restaurant menu. You shouldn't have a single menu that forces you to read through meat dishes, vegan dishes, and desserts if you only want coffee. Provide separate, specialized menus (or sections) so clients only see what they need.

### Key Points
- Keep interfaces small and focused.
- Clients shouldn't be forced to implement methods they don't need.
- Often throwing `UnsupportedOperationException` is a sign of an ISP violation.
