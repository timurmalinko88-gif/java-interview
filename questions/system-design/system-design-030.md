---
id: system-design-030
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 85%
source: Custom
prerequisites: ["Architecture", "Resiliency"]
---

# High Availability (Active-Active vs Active-Passive)

When designing a highly available architecture, what is the difference between an Active-Active and an Active-Passive configuration? What are the pros and cons of each?

---ANSWER---

Both strategies involve deploying redundant identical systems (servers, databases, or entire data centers) to ensure maximum uptime.

**Active-Passive (Primary-Standby)**
- *How it works*: Only the Primary (Active) node handles live traffic. The Standby (Passive) node sits idle, often just receiving replicated data to stay up-to-date. If the Active node fails, a failover mechanism routes traffic to the Passive node, making it the new Active node.
- *Pros*: Simple to design and configure. Data consistency is easier to manage (no write conflicts).
- *Cons*: **Wasted Resources**. You are paying for hardware/cloud resources that do absolutely nothing 99% of the time. There is a slight delay (downtime) during the failover process.

**Active-Active**
- *How it works*: All nodes are actively receiving and processing live traffic simultaneously. A Load Balancer distributes the traffic among them.
- *Pros*: **Zero wasted resources**. Can handle higher overall throughput. Failover is instantaneous (if a node dies, the load balancer simply stops routing to it; the others continue without interruption).
- *Cons*: Highly complex, especially at the database layer. You must handle data synchronization and conflict resolution (since writes can happen anywhere simultaneously).

### Life Analogy
Imagine a commercial airplane cockpit.
- **Active-Passive**: The Captain (Active) flies the plane. The Co-pilot (Passive) watches but doesn't touch the controls unless the Captain has a heart attack. (Safe, but the Co-pilot's flying skills are wasted most of the flight).
- **Active-Active**: Both pilots have their hands on the controls at the same time, sharing the work. (Highly efficient, but requires intense coordination to avoid fighting each other).

### Key Points
- Active-Passive keeps a redundant system idle for emergencies (wastes resources, easier to build).
- Active-Active uses all systems simultaneously (efficient, instant failover, but very complex data synchronization).
