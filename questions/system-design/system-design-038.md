---
id: system-design-038
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Load Balancing", "Architecture"]
tags: [spring-core, system-design, patterns, memory, multithreading]
---

# Sticky Sessions

What are Sticky Sessions (Session Affinity)? When are they used, and why are they generally considered an anti-pattern in modern scalable system design?

---ANSWER---

**What they are:**
Sticky Sessions are a configuration on a Load Balancer. When a user makes their first request, the load balancer routes them to a specific backend server (e.g., Server A). The load balancer then "remembers" this routing (usually by injecting a cookie into the user's browser). Every subsequent request from that user is guaranteed to be routed to Server A.

**Why they were used:**
Historically, servers stored user session data (like a shopping cart or login state) in their local memory (RAM). If the next request went to Server B, Server B wouldn't know who the user was. Sticky sessions ensured the user always talked to the server holding their memory.

**Why it's an Anti-Pattern today:**
1. **Uneven Load Distribution**: Some users are heavier than others. If 1,000 heavy users get "stuck" to Server A, and 1,000 light users get stuck to Server B, Server A will crash while Server B sits idle. The load balancer can't redistribute the traffic.
2. **Fault Intolerance**: If Server A crashes, all 1,000 users stuck to it lose their session data instantly and are logged out.

**The Modern Solution:**
Stateless Architecture. Servers should store *zero* state in local memory. All session data is pushed to a fast, centralized, external datastore like **Redis** or Memcached. The load balancer uses simple Round-Robin routing. If a request hits Server B, Server B just fetches the session from Redis.

### Life Analogy
Sticky Sessions: You go to a massive DMV with 10 clerks. You talk to Clerk #3. You realize you forgot a form in your car. When you come back, you *must* wait for Clerk #3 to be available again because only they remember your case, even if Clerk #7 is doing nothing.
Stateless: Every clerk uses a centralized computer system. When you come back, you go to the first available clerk (Clerk #7). They pull up your file on the computer and continue exactly where Clerk #3 left off.

### Key Points
- Sticky sessions force a user's traffic to always hit the same server.
- They cause uneven load distribution and data loss on server failure.
- Modern architectures avoid them by storing state externally in Redis (Stateless Services).
