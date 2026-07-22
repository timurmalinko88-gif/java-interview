---
id: system-design-026
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 85%
source: Custom
prerequisites: ["Architecture", "Resiliency"]
tags: ['system-design']
---

# Single Point of Failure (SPOF)

What is a Single Point of Failure (SPOF)? How do you identify and mitigate SPOFs in a system design?

---ANSWER---

A **Single Point of Failure (SPOF)** is any component in a system that, if it fails, will cause the entire system (or a major business workflow) to stop functioning.

**Identifying SPOFs:**
Look at an architecture diagram and ask, "If I pull the plug on this box, what happens?"
Common SPOFs include:
- A single Load Balancer routing all traffic.
- A single Master Database instance.
- A single API Gateway.
- An overly centralized configuration server.
- Even non-technical things, like a single developer holding the only root password.

**Mitigating SPOFs:**
The primary mitigation strategy is **Redundancy** (Duplication).
1. **Network/Load Balancer Level**: Deploy load balancers in an Active-Passive pair. If the active one dies, the passive one takes over the IP address.
2. **Application Level**: Deploy multiple instances of stateless microservices behind a load balancer across different Availability Zones (AZs) or regions.
3. **Database Level**: Use Master-Slave replication with automatic failover, or Peer-to-Peer replication (like Cassandra).
4. **Third-Party Services**: Build fallback mechanisms (Circuit Breakers) so if a 3rd party payment API fails, your app degrades gracefully instead of crashing.

### Life Analogy
If you only have one key to your house, that key is a SPOF. If you lose it, you can't get in. Mitigation is creating a spare key (Redundancy) and keeping it at a friend's house (Availability Zone).

### Key Points
- A SPOF brings down the whole system if it fails.
- Identified by mapping dependencies and imagining failures.
- Mitigated almost exclusively through redundancy and automated failover.
