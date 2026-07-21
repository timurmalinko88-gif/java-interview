---
id: patterns-037
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Anti-patterns"]
---

# Anti-pattern: Golden Hammer
What is the Golden Hammer (or Law of the Instrument) anti-pattern? 

---ANSWER---

The Golden Hammer anti-pattern is an over-reliance on a familiar tool, technology, or concept, ignoring others that might be better suited for the job. 

It comes from the saying: "If all you have is a hammer, everything looks like a nail."

In software, this happens when a team or developer learns a new design pattern, framework, or database and tries to apply it to *every* problem they encounter, regardless of whether it's a good fit. 
For example, using a heavy NoSQL database for highly relational, transaction-heavy financial data just because the team recently learned MongoDB, or applying the Abstract Factory pattern to create a simple String.

### Life Analogy
Using a high-powered chainsaw to cut a piece of string. It might work eventually, but a pair of scissors would have been much easier, safer, and more appropriate.

### Key Points
- Overusing a familiar tool.
- Ignoring context and better alternatives.
- Often caused by hype-driven development or lack of broad experience.
