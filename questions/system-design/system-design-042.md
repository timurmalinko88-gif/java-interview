---
id: system-design-042
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 85%
source: Custom
prerequisites: ["Containers", "Architecture"]
---

# Container Orchestration (Kubernetes)

Why do we need Container Orchestration tools like Kubernetes? What happens when a container running a microservice crashes in a Kubernetes cluster?

---ANSWER---

**The Problem:**
Docker makes it easy to package and run a single microservice on your laptop. But in production, you might have 50 different microservices, and you need to run 10 copies of each across 100 physical servers.
How do you deploy them? How do they find each other (Service Discovery)? How do you scale them up when traffic spikes? What if a server catches fire? Doing this manually with SSH and Docker commands is impossible.

**The Solution: Container Orchestration (Kubernetes)**
Kubernetes (K8s) is a system that automates the deployment, scaling, and management of containerized applications.

**Core Responsibilities:**
1. **Scheduling**: You tell K8s, "I need 5 copies of the User Service." K8s looks at the cluster, finds servers (Nodes) with available RAM/CPU, and places the containers (Pods) there.
2. **Self-Healing**: K8s constantly monitors the health of the Pods. If a container crashes, or an entire physical server dies, K8s immediately notices the desired state (5 copies) does not match the actual state (4 copies) and automatically spins up a replacement container on a healthy node.
3. **Service Discovery & Load Balancing**: K8s provides internal IP addresses and DNS names for services, automatically load-balancing traffic across all healthy Pods.
4. **Horizontal Scaling**: Based on CPU usage, K8s can automatically spin up more Pods.

### Life Analogy
Docker is an individual musician. Kubernetes is the Conductor of the orchestra. The conductor doesn't play the instruments, but tells the musicians where to sit, when to start playing, when to play louder (scale up), and immediately replaces a musician if they fall out of their chair (self-healing), ensuring the symphony sounds perfect.

### Key Points
- Kubernetes manages the lifecycle of thousands of containers across a cluster of machines.
- It provides self-healing, automatic scaling, and service discovery.
- It operates on a declarative model: you define the desired state, and K8s makes it happen.
