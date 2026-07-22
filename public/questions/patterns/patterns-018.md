---
id: patterns-018
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: [oop, spring-core, system-design, patterns]
---

# What is the Memento Pattern?
Explain the Memento design pattern. How does it ensure encapsulation while allowing an object's state to be saved and restored?

---ANSWER---

The Memento pattern is a behavioral pattern that lets you save and restore the previous state of an object without revealing the details of its implementation.

It achieves encapsulation by using three objects:
1. **Originator**: The object whose state needs saving. It creates the Memento.
2. **Memento**: A value object acting as a snapshot of the Originator's state. Crucially, it restricts access to its fields. Only the Originator that created it can read its internal state.
3. **Caretaker**: Manages the history of Mementos. It can request a Memento from the Originator and pass it back later to restore state, but it *cannot* inspect the contents of the Memento.

In Java, this restricted access is often implemented using nested static classes, where the Memento is a private inner class of the Originator, meaning only the Originator has access to its private fields.

### Life Analogy
Saving a game. You (Originator) tell the console (Caretaker) to create a save file (Memento). The console stores the file, but it doesn't know what the bytes mean. When you want to load, the console gives the file back to the game engine, which is the only thing that can decode it and restore your progress.

### Key Points
- Captures and restores object state.
- Preserves encapsulation (Caretaker cannot read Memento data).
- Often implemented with private inner classes in Java.
