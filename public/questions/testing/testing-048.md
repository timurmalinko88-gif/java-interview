---
id: testing-048
topic: Testing
difficulty: Senior
format: System Design
time: 5
frequency: 50%
source: Custom
prerequisites: ["REST"]
tags: [testing, spring-core, spring-mvc, system-design]
---

# Richardson Maturity Model

What is the Richardson Maturity Model for REST APIs?

---ANSWER---

It grades APIs on their adherence to REST principles:
- **Level 0:** The Swamp of POX (Plain Old XML) - single endpoint, HTTP as transport only.
- **Level 1:** Resources - multiple endpoints (e.g., `/users`, `/orders`).
- **Level 2:** HTTP Verbs - uses GET, POST, PUT, DELETE correctly.
- **Level 3:** Hypermedia Controls (HATEOAS) - API is discoverable via links.

### Life Analogy
It's a grading rubric for how "RESTful" an API actually is, from a chaotic dump (Level 0) to a perfectly organized library (Level 3).

### Key Points
- Measures REST compliance.
- Levels 0 to 3.
