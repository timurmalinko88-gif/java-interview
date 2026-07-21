---
id: system-design-006
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 85%
source: Custom
prerequisites: ["Networking", "Load Balancing"]
---

# Load Balancing (Layer 4 vs Layer 7)

Explain the difference between Layer 4 and Layer 7 load balancing in the OSI model. Give an example of a situation where you would prefer one over the other.

---ANSWER---

**Layer 4 Load Balancing (Transport Layer)**
- *How it works*: Operates at the Transport Layer (TCP/UDP). It makes routing decisions based on IP addresses and ports without looking into the contents of the message.
- *Pros*: Fast, efficient, uses less CPU and memory since it doesn't decrypt or inspect traffic.
- *Cons*: Cannot route based on application content (e.g., URL paths or cookies).
- *Use case*: When you need pure speed and high throughput, or when load balancing non-HTTP traffic (e.g., database connections, custom TCP protocols).

**Layer 7 Load Balancing (Application Layer)**
- *How it works*: Operates at the Application Layer (HTTP/HTTPS, SMTP). It decrypts the traffic, inspects the headers/payload (like URL, cookies), and makes complex routing decisions based on the content.
- *Pros*: Smart routing. You can route `/api/users` to a specific microservice and `/api/payments` to another. Can implement sticky sessions based on cookies.
- *Cons*: Slower and more resource-intensive because it requires terminating SSL/TLS and parsing HTTP requests.
- *Use case*: Microservices architectures, API gateways, or when you need URL-based routing and SSL termination.

### Life Analogy
Layer 4 is like a post office worker sorting mail purely by zip code without opening the envelopes. It's fast. Layer 7 is like an administrative assistant who opens the letters, reads the content, and forwards it to the specific department (HR, Billing) based on the letter's subject.

### Key Points
- Layer 4 (TCP) routes by IP/Port; it's fast and content-ignorant.
- Layer 7 (HTTP) routes by content (URL, headers); it's smarter but requires more processing.
