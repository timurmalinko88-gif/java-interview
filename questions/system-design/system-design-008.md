---
id: system-design-008
topic: System Design
difficulty: Middle
format: System Design
time: 20
frequency: 75%
source: Custom
prerequisites: ["Observability", "Microservices"]
---

# Distributed Tracing and Correlation IDs

In a microservices architecture, a single user request might travel through 5 different services. If the request fails, how do you debug it? Explain the concept of Distributed Tracing and Correlation IDs.

---ANSWER---

Debugging across multiple separate services is incredibly difficult because logs are scattered across different servers and contexts.

**Distributed Tracing** solves this by tracking a request as it flows through the distributed system.

**How it works (Correlation IDs):**
1. **Ingress**: When an external request hits the first service (e.g., an API Gateway), a unique identifier called a **Correlation ID** (or Trace ID) is generated.
2. **Propagation**: This Correlation ID is attached to the HTTP headers (e.g., `X-Correlation-ID`) or message payloads for every subsequent downstream call to other microservices.
3. **Logging**: Every microservice includes this Correlation ID in its log entries.
4. **Aggregation**: A centralized logging system (like ELK Stack - Elasticsearch, Logstash, Kibana) or a tracing tool (like Jaeger or Zipkin) collects all logs.
5. **Visualization**: A developer can search for that specific Correlation ID to see the entire lifecycle of the request, identifying exactly which service threw the error or caused latency.

### Life Analogy
Imagine a package shipped internationally. As it passes through various couriers and customs (microservices), everyone scans the exact same tracking number (Correlation ID). If the package is lost, you simply look up the tracking number to see its entire journey and pinpoint exactly where it went missing.

### Key Points
- A Correlation ID is generated at the entry point of the architecture.
- It must be passed along to all downstream services.
- Tools like Jaeger or Zipkin visualize these traces to identify bottlenecks and errors.
