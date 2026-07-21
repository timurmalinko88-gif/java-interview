---
id: testing-035
topic: Testing
difficulty: Middle
format: System Design
time: 10
frequency: 85%
source: Custom
prerequisites: ["Security"]
---

# JWT vs Sessions

Compare JWT authentication with Session-based authentication.

---ANSWER---

**Sessions:**
- Server stores session data (stateful).
- Client stores a Session ID in a cookie.
- Easy to revoke. Harder to scale (requires sticky sessions or a shared cache like Redis).

**JWT:**
- Server stores nothing (stateless).
- Client stores token and sends it with every request.
- Easy to scale. Hard to revoke.

### Life Analogy
Session is a VIP list at the door (bouncer checks list). JWT is a VIP wristband (bouncer checks wrist, doesn't need a list).

### Key Points
- Session = Stateful, hard to scale, easy to revoke.
- JWT = Stateless, easy to scale, hard to revoke.
