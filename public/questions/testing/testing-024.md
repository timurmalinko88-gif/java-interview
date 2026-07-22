---
id: testing-024
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Mockito"]
tags: ['testing']
---

# Mockito @Spy

What is a Spy in Mockito?

---ANSWER---

A Spy creates a partial mock of a real object. Unlike a pure mock (where all methods do nothing by default), a spy calls the real methods of the object unless explicitly stubbed.

### Life Analogy
A mock is an actor pretending to be a doctor. A spy is a real doctor who occasionally acts out a fake script when you ask them to.

### Key Points
- Partial mock.
- Calls real methods by default.
