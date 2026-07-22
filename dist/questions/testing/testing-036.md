---
id: testing-036
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["OAuth2"]
tags: [spring-core, testing, stream-api]
---

# OAuth2 Grant Types

What are the common OAuth2 Grant Types?

---ANSWER---

1. **Authorization Code:** For server-side apps (most secure).
2. **Implicit:** For SPAs (legacy, mostly replaced by Auth Code with PKCE).
3. **Client Credentials:** For machine-to-machine (no user involved).
4. **Resource Owner Password Credentials:** Client collects username/password directly (legacy/untrusted).

### Life Analogy
Different ways to get a movie ticket: Auth Code is buying online and showing a QR code. Client Credentials is a VIP pass. Password is giving the cashier your wallet.

### Key Points
- Different flows for different clients.
- Auth Code is standard for web.
