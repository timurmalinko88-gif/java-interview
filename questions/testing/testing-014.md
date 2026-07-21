---
id: testing-014
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["QA"]
---

# E2E Testing Downsides

Why shouldn't you rely entirely on End-to-End (E2E) tests?

---ANSWER---

While E2E tests provide the highest confidence that the system works as a whole, relying entirely on them is an anti-pattern (the "Ice Cream Cone" pattern) because:
1. **Slow:** They take a long time to run.
2. **Brittle:** Minor UI changes or network blips can cause them to fail randomly (flaky).
3. **Hard to debug:** A failure doesn't point to the specific line of code that broke.

### Life Analogy
Testing a car by only driving it on the highway. If it stops, you know it's broken, but you have no idea if it's the engine, gas, or tires.

### Key Points
- High confidence but slow and flaky.
- Expensive to maintain.
- Difficult to pinpoint root causes.
