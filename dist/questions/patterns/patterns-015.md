---
id: patterns-015
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 65%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Command Pattern?
Explain the Command design pattern. How is it useful for implementing undo functionality?

---ANSWER---

The Command pattern is a behavioral pattern that turns a request into a stand-alone object containing all information about the request. This transformation lets you pass requests as method arguments, delay or queue a request's execution, and support undoable operations.

It involves four main components: the Command interface, Concrete Commands, the Invoker, and the Receiver.

It is highly useful for **undo functionality** because each Concrete Command object can implement an `undo()` method alongside its `execute()` method. The `undo()` method contains the reverse logic of `execute()`. The application can maintain a history stack of executed command objects. When the user clicks "Undo", the application simply pops the last command from the stack and calls its `undo()` method.

### Life Analogy
Ordering at a diner. You (Client) give an order to the Waiter (Invoker). The Waiter writes it on a slip of paper (Command Object) and puts it on the order queue. The Chef (Receiver) eventually takes the slip and cooks the meal.

### Key Points
- Encapsulates a request as an object.
- Enables queuing, logging, and undo/redo operations.
- Separates the invoker of a request from the receiver that performs it.
