---
id: testing-037
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["HTTP"]
tags: [spring-core, testing, stream-api, multithreading]
---

# HTTP/2 Features

What are the main improvements in HTTP/2 over HTTP/1.1?

---ANSWER---

1. **Multiplexing:** Multiple requests/responses can be sent concurrently over a single TCP connection.
2. **Binary Framing:** Data is sent in binary rather than plain text.
3. **Header Compression (HPACK):** Reduces overhead of headers.
4. **Server Push:** Server can proactively send resources to the client.

### Life Analogy
HTTP/1.1 is a one-lane road. HTTP/2 is a multi-lane highway where cars (packets) can overtake each other.

### Key Points
- Multiplexing reduces latency.
- Binary instead of text.
