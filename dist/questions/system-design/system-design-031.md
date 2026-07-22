---
id: system-design-031
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 70%
source: Custom
prerequisites: ["Distributed Systems", "Resiliency"]
tags: ['system-design']
---

# Heartbeats and Failure Detection

How do distributed systems detect when a node has crashed? Explain the concept of Heartbeats and the challenge of choosing the right timeout interval.

---ANSWER---

In a distributed system, nodes can fail silently (crash, lose power, or get disconnected by a network partition). Other nodes or load balancers need a way to detect this failure so they can stop sending traffic to the dead node and initiate recovery/failover.

**Heartbeats:**
The standard mechanism is for the worker node to periodically send a "Heartbeat" (a small ping message) to a central coordinator or to other peer nodes (via Gossip protocol) saying, "I am alive."

**The Timeout Challenge:**
If a coordinator doesn't receive a heartbeat from a node for a specific amount of time, it declares the node "Dead."
- **Too short timeout (e.g., 50ms)**: High risk of **False Positives**. A slight network hiccup or a heavy garbage collection pause in Java might delay the heartbeat, causing the system to mistakenly declare the node dead and trigger an unnecessary and expensive failover process.
- **Too long timeout (e.g., 5 minutes)**: High risk of **False Negatives** (delaying the truth). If a node actually dies, the system will continue routing traffic to the dead node for 5 minutes, resulting in thousands of failed requests for users.

*Solution*: Many systems use dynamic/adaptive failure detection (like the Phi Accrual Failure Detector used in Cassandra and Akka), which calculates the probability of a node being dead based on historical heartbeat delays, rather than a hardcoded timeout.

### Life Analogy
Imagine a security guard required to radio the base every 10 minutes (Heartbeat). If he doesn't radio in after 11 minutes, do you assume he's dead and call the SWAT team (Short timeout)? He might just be in the bathroom. But if you wait 3 hours before calling for help (Long timeout), it might be too late.

### Key Points
- Nodes send periodic pings to prove they are alive.
- Hardcoded timeouts are tricky: too short causes false failovers; too long causes bad user experience.
- Advanced systems use probabilistic models (Phi Accrual) to detect failure.
