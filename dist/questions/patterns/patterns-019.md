---
id: patterns-019
topic: Patterns
difficulty: Junior
format: Code Review
time: 5
frequency: 90%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: [oop, spring-core, system-design, patterns, memory, collections]
---

# What is the Observer Pattern?
Explain the Observer pattern. How is it implemented and what are its main advantages?

---ANSWER---

The Observer pattern is a behavioral pattern that defines a one-to-many dependency between objects. When one object (the Subject or Publisher) changes state, all its dependents (Observers or Subscribers) are notified and updated automatically.

It is implemented by having the Subject maintain a list of Observer references. The Subject provides methods to attach and detach Observers. When a state change occurs, the Subject iterates through its list and calls an `update()` method on each Observer. 

The main advantage is loose coupling. The Subject doesn't need to know anything about the concrete classes of its Observers, only that they implement a specific Observer interface. This makes it easy to add new types of Observers without changing the Subject.

### Life Analogy
Subscribing to a YouTube channel. The channel creator (Subject) doesn't know who you are. When they upload a new video, YouTube notifies all subscribers (Observers). You can subscribe or unsubscribe at any time.

### Key Points
- Defines a one-to-many relationship.
- Promotes loose coupling between Subject and Observers.
- Foundational to Event-Driven architecture and Reactive programming.
