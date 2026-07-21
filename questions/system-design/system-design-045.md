---
id: system-design-045
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 85%
source: Custom
prerequisites: ["Architecture", "Deployment"]
---

# Blue-Green vs Canary Deployments

Deploying new code to production is risky. Explain the Blue-Green Deployment strategy and the Canary Release strategy. How do they minimize downtime and risk?

---ANSWER---

**1. Blue-Green Deployment:**
- *How it works*: You maintain two identical production environments: "Blue" (currently active, serving 100% of user traffic) and "Green" (idle). 
- *The Deploy*: You deploy the new code version to the Green environment. You run internal tests on it. Once satisfied, you flip the Load Balancer switch, routing 100% of user traffic to Green instantly. Blue becomes the new idle environment.
- *Pros*: **Zero Downtime**. Instant rollback (just flip the switch back to Blue if things break).
- *Cons*: Expensive. You must pay for double the infrastructure because you maintain two full production environments.

**2. Canary Release:**
- *How it works*: You deploy the new code to a small subset of servers. You configure the Load Balancer to route a tiny percentage of live user traffic (e.g., 5%) to the new "Canary" version, while 95% goes to the old version.
- *The Deploy*: You closely monitor logs and error rates for the 5%. If there are no bugs, you gradually increase the traffic (10%, 25%, 100%) and roll out the code to the rest of the servers.
- *Pros*: Minimizes the "blast radius." If the new code has a fatal bug, only 5% of users experience it, rather than 100%. Cheaper than Blue-Green.
- *Cons*: Slower deployment process. Managing backward compatibility between the two versions running simultaneously (especially database schema changes) is complex.

### Life Analogy
**Blue-Green**: Building a brand new bridge next to the old one. You test it with empty trucks. Once sure, you move the barricades so all cars instantly use the new bridge.
**Canary**: Miners used to bring a canary into the coal mine. If there were toxic gases, the canary would die first, warning the miners to escape. In software, 5% of your users act as the canary to test the new code before everyone else gets it.

### Key Points
- Blue-Green swaps 100% of traffic instantly between two identical environments. Great for instant rollbacks.
- Canary slowly shifts traffic (5% -> 100%) to limit the blast radius of bugs. Great for risk mitigation.
