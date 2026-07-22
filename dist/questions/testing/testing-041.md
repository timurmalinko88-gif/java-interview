---
id: testing-041
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["REST"]
tags: ['testing']
---

# GraphQL vs REST

What is the main advantage of GraphQL over REST?

---ANSWER---

GraphQL allows the client to specify exactly what data it needs in a single request, preventing over-fetching (getting too much data) and under-fetching (needing to make multiple requests). REST typically returns fixed data structures per endpoint.

### Life Analogy
REST is a set menu at a restaurant; you get exactly what's on the plate. GraphQL is a buffet where you only put what you want on your plate.

### Key Points
- Solves over-fetching and under-fetching.
- Single endpoint.
