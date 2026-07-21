---
id: testing-006
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["HTTP", "WebSockets"]
tags: [testing, spring-core, multithreading]
---

# WebSockets vs HTTP

Explain the difference between WebSockets and HTTP.

---ANSWER---

HTTP is a unidirectional, stateless, request-response protocol. The client must initiate the request, and the server responds. 
WebSockets provide a full-duplex, bidirectional communication channel over a single TCP connection. Once the connection is established via an HTTP handshake, both the client and server can send data independently at any time.

### Life Analogy
HTTP is like sending a letter and waiting for a reply. WebSockets is like making a phone call where both parties can talk at the same time.

### Key Points
- HTTP is unidirectional; WebSockets are bidirectional.
- WebSockets allow server-to-client push.
