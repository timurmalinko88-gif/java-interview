---
id: patterns-020
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
---

# State Pattern vs Strategy Pattern
Explain the State pattern and compare it to the Strategy pattern. When would you use one over the other?

---ANSWER---

The State pattern lets an object alter its behavior when its internal state changes. It appears as if the object changed its class. 

Both State and Strategy patterns are based on composition: they delegate work to a helper object. However, their intents differ:
- **Strategy**: The client provides the context with a specific Strategy. The Strategies are completely independent and unaware of each other. It's about swapping algorithms (e.g., sorting algorithms, payment methods).
- **State**: The context's behavior depends on its current State. States are often aware of each other and can initiate transitions from one state to another. It's about modeling a finite state machine (e.g., a media player changing from Playing to Paused).

Use Strategy when you want to configure an object with one of many behaviors. Use State when an object's behavior depends on its lifecycle and it needs to transition between different states automatically.

### Life Analogy
**Strategy**: Choosing how to get to work (drive, bus, bike). You pick one strategy for the whole trip.
**State**: Water changing states (ice, liquid, gas). The behavior of the water changes automatically based on its temperature (state), and ice knows it can melt into liquid.

### Key Points
- State pattern models a state machine; states can trigger transitions.
- Strategy pattern models interchangeable algorithms chosen by the client.
- Both use composition and delegation.
