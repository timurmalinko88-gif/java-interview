---
id: system-design-013
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 75%
source: Custom
prerequisites: ["HTTP", "Networking"]
---

# Long Polling vs WebSockets vs Server-Sent Events (SSE)

Explain the differences between Short Polling, Long Polling, WebSockets, and Server-Sent Events. When would you use each to implement a real-time feature (like a chat app or a stock ticker)?

---ANSWER---

Standard HTTP is stateless and request-response based. The server cannot spontaneously send data to the client. Real-time apps need workarounds:

1. **Short Polling**:
   - The client repeatedly sends HTTP requests every N seconds (e.g., "Any new messages?").
   - *Cons*: Hugely inefficient. Generates massive empty network traffic and server load.

2. **Long Polling**:
   - The client sends a request. The server *holds the connection open* until new data is available or a timeout occurs. Once data is sent, the client immediately opens a new long-poll request.
   - *Pros*: Reduces empty responses compared to short polling.
   - *Cons*: Still incurs HTTP header overhead. Connection management can be tricky.

3. **WebSockets**:
   - Establishes a persistent, full-duplex, bidirectional TCP connection between client and server. Both can send data at any time.
   - *Pros*: Extremely low latency. Minimal overhead per message (no HTTP headers).
   - *Cons*: Difficult to load balance and scale (requires sticky sessions or a pub/sub backplane like Redis).
   - *Use case*: Multiplayer games, real-time chat apps, collaborative editing (Google Docs).

4. **Server-Sent Events (SSE)**:
   - A persistent, unidirectional connection where the server pushes data to the client over standard HTTP.
   - *Pros*: Simpler than WebSockets, works over standard HTTP/HTTPS, built-in reconnection logic in browsers.
   - *Cons*: Unidirectional (Server to Client only).
   - *Use case*: Live news feeds, stock tickers, notification systems.

### Life Analogy
- **Short Polling**: Kids in a car constantly asking "Are we there yet?" every 5 minutes.
- **Long Polling**: Kid asks "Are we there yet?", parent ignores them for 3 hours until they arrive, then says "Yes". Kid immediately asks "Are we at the hotel yet?"
- **WebSockets**: A phone call. Both parties can talk simultaneously at any time.
- **SSE**: A radio broadcast. The station transmits music continuously, and you just listen.

### Key Points
- Use WebSockets for bidirectional, low-latency, high-frequency data (Games, Chat).
- Use SSE for unidirectional data streaming (Stock ticker, Notifications).
- Avoid Short Polling; use Long Polling only as a fallback for older browsers.
