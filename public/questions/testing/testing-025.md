---
id: testing-025
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["JUnit 5"]
tags: ['testing']
---

# JUnit 5 Assumptions

What are Assumptions in JUnit 5?

---ANSWER---

Assumptions (`assumeTrue`, `assumeFalse`) evaluate conditions before running a test. If the assumption fails, the test is aborted (skipped), not marked as failed. Useful for tests that should only run in specific environments.

### Life Analogy
Assuming it's not raining before planning a picnic. If it rains, the picnic is canceled (aborted), not a failure.

### Key Points
- Aborts test if condition is not met.
- Does not cause a test failure.
