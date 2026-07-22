---
id: system-design-028
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 75%
source: Custom
prerequisites: ["Microservices", "Networking"]
tags: ['system-design']
---

# Service Discovery (Consul / Eureka)

In a microservices environment where instances are constantly spinning up and down in the cloud, how do services find each other's IP addresses? Explain the concept of Service Discovery.

---ANSWER---

In a monolithic or static environment, you might hardcode IP addresses or use static DNS. In modern cloud environments (Kubernetes, AWS), IP addresses are dynamic. A container might crash and be replaced with a new one possessing a new IP in seconds.

**Service Discovery** solves this problem by acting as a dynamic phonebook for microservices.

**How it works (Client-Side Discovery):**
1. **Registration**: When a new instance of `UserService` boots up, it registers its IP address, port, and health status with a central Service Registry (e.g., Netflix Eureka, HashiCorp Consul, or Zookeeper).
2. **Heartbeats**: The `UserService` sends periodic heartbeats to the registry to say "I'm still alive." If it crashes, the registry removes it.
3. **Discovery**: When `OrderService` wants to call `UserService`, it queries the Service Registry: "Give me the IPs of all healthy UserServices."
4. **Routing**: `OrderService` uses a client-side load balancer (like Ribbon) to pick one of those IPs and makes the HTTP call.

*(Note: In Kubernetes, this is mostly handled natively via DNS and `Service` abstractions, which act as Server-Side Discovery).*

### Life Analogy
Think of a Service Registry like the contact list in your phone, constantly updated by the cloud. Instead of memorizing your friend's phone number (which changes every time they get a new phone), you just look up their name "John", and the phone dials the correct, current number automatically.

### Key Points
- Solves the problem of dynamic IP addresses in the cloud.
- Services register themselves on startup and send health heartbeats.
- Other services query the registry to find the current IPs before making calls.
