---
id: testing-033
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["REST"]
---

# REST HATEOAS

What is HATEOAS in REST?

---ANSWER---

Hypermedia as the Engine of Application State (HATEOAS) is a constraint of the REST architecture. It means a client interacts with a network application entirely through hypermedia (links) provided dynamically by application servers. The client needs little to no prior knowledge of how to interact with the API beyond understanding hypermedia.

### Life Analogy
It's like navigating a website by clicking links on a webpage, rather than typing the exact URL into the browser bar every time.

### Key Points
- Links included in responses.
- Decouples client and server API routing.
