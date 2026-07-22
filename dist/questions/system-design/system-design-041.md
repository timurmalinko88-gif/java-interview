---
id: system-design-041
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["Microservices", "Networking"]
tags: ['system-design']
---

# Service Mesh (Istio / Linkerd)

In a massive microservices architecture, what is a Service Mesh? What specific problems does it solve that an API Gateway does not?

---ANSWER---

An **API Gateway** handles "North-South" traffic: traffic entering the cluster from the outside world (clients, mobile apps).
A **Service Mesh** (like Istio or Linkerd) handles "East-West" traffic: the internal communication *between* the microservices themselves.

**The Problem:**
When you have 500 microservices talking to each other, you face complex networking challenges: retries, timeouts, circuit breaking, mutual TLS (mTLS) encryption, and tracing. If every developer writes this logic in Java, Node, and Python inside their application code, it becomes a maintenance nightmare.

**The Solution (Service Mesh):**
A Service Mesh extracts all this network logic out of the application code and puts it into an infrastructure layer.
- **Sidecar Proxy**: The mesh injects a tiny proxy container (like Envoy) directly alongside every single microservice instance (in the same Kubernetes Pod).
- **Interception**: When Service A wants to call Service B, Service A just makes a simple HTTP call to localhost. The Sidecar proxy intercepts it, encrypts it (mTLS), handles retries, routes it to Service B's Sidecar, which decrypts it and hands it to Service B.

**Key Features:**
- **Security**: Zero-trust networking (automatic mTLS between all services).
- **Reliability**: Automatic retries, timeouts, and circuit breakers without changing app code.
- **Observability**: The proxies automatically generate distributed tracing spans and metrics for every single network hop.

### Life Analogy
Imagine a massive corporation with 500 departments. An API Gateway is the front desk receptionist for external visitors. A Service Mesh is the internal corporate mailroom system. You just drop a letter in your local outbox (localhost); the mailroom (Sidecar) encrypts it, guarantees delivery, and handles routing to the exact department you need, all without you having to know the internal floor plans.

### Key Points
- Manages East-West traffic (internal service-to-service communication).
- Uses the Sidecar pattern (a proxy deployed next to every service).
- Decouples network logic (security, retries, tracing) from business logic.
