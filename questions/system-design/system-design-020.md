---
id: system-design-020
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Networking", "Proxies"]
---

# Forward Proxy vs Reverse Proxy

Explain the difference between a Forward Proxy and a Reverse Proxy. Give practical use cases for each.

---ANSWER---

**Forward Proxy (Client-side Proxy)**
A Forward Proxy sits in front of one or more *clients* and intercepts their outbound requests to the internet.
- *How it works*: The client sends a request to the proxy. The proxy forwards it to the internet, receives the response, and sends it back to the client. The internet server only sees the proxy's IP, not the client's.
- *Use cases*: 
  - **Content Filtering**: Corporate networks blocking employees from accessing social media.
  - **Anonymity**: VPNs or Tor, hiding the user's IP from the destination website.
  - **Caching**: Caching frequently visited sites to save bandwidth for a school or office.

**Reverse Proxy (Server-side Proxy)**
A Reverse Proxy sits in front of one or more *servers* and intercepts inbound requests from the internet.
- *How it works*: The client from the internet sends a request to your application's domain. The reverse proxy receives it and routes it to the appropriate internal server (which is hidden from the outside world).
- *Use cases*:
  - **Load Balancing**: Distributing traffic across multiple backend servers (e.g., Nginx, HAProxy).
  - **Security**: Hiding the IP addresses and architecture of the backend servers. Preventing DDoS attacks.
  - **SSL Termination**: Handling HTTPS decryption centrally so backend servers don't waste CPU on cryptography.
  - **API Gateway**: A specialized reverse proxy for routing to microservices.

### Life Analogy
A **Forward Proxy** is like a personal assistant making calls on your behalf. The person you are calling only knows the assistant is calling, not you. (Protects the caller).
A **Reverse Proxy** is like a company receptionist. You call the main company number, and the receptionist routes you to the correct department. You don't know the direct extension of the person you're talking to. (Protects the receiver).

### Key Points
- Forward Proxy protects/represents the **Client**.
- Reverse Proxy protects/represents the **Server**.
- Reverse proxies are heavily used in System Design for load balancing and API gateways.
