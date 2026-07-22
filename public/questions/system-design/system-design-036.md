---
id: system-design-036
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 65%
source: Custom
prerequisites: ["CDN", "Networking"]
tags: ['system-design']
---

# Content Delivery Network (CDN) - Dynamic Content

While CDNs are widely known for caching static assets (images, CSS), can a CDN be used to accelerate the delivery of *dynamic* content (like a user's customized feed or a search result)? If so, how?

---ANSWER---

Yes, modern CDNs can accelerate dynamic, uncacheable content, although the mechanism is completely different from caching static files.

**How Dynamic Acceleration Works:**
You cannot cache a personalized user feed on the edge server because it changes constantly and is unique per user. Instead, the CDN accelerates the *network path* between the user and your origin server.

1. **Edge TCP Termination**: Establishing a TCP connection and TLS handshake requires multiple round-trips. If a user in India connects to a server in the US, latency is huge. With a CDN, the user connects to the Edge server in India. The TLS handshake happens locally, saving hundreds of milliseconds.
2. **Persistent Origin Connections**: The CDN Edge server maintains a pool of pre-warmed, persistent, long-lived TCP/TLS connections to the Origin server. When the user requests dynamic content, the Edge server multiplexes the request over these already-open connections, bypassing handshake latency entirely.
3. **Route Optimization**: Standard internet routing (BGP) is "best effort" and often routes traffic through congested, suboptimal hops. CDNs possess massive private global backbones. They analyze traffic in real-time and route the dynamic request through their optimized, uncongested private network straight to your origin.

### Life Analogy
Imagine ordering custom furniture from another country. You (the user) want to talk to the factory (Origin). 
Without a CDN, you have to find an international operator, wait on hold, and deal with bad reception.
With a CDN (Dynamic Acceleration), you walk into a local branch office (Edge Server). The branch manager immediately picks up a dedicated, static red phone line directly to the factory. You get your custom answer much faster.

### Key Points
- Dynamic content cannot be cached on edge servers.
- CDNs accelerate dynamic content by optimizing the network path.
- This includes edge TLS termination, persistent connections to the origin, and private backbone routing.
