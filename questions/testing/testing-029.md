---
id: testing-029
topic: Testing
difficulty: Senior
format: System Design
time: 5
frequency: 80%
source: Custom
prerequisites: ["JWT"]
---

# JWT Security Risks

What are the security risks of using JWTs?

---ANSWER---

- Storing them in LocalStorage makes them vulnerable to XSS.
- They cannot be easily revoked before expiration since they are stateless.
- If the signing key is weak, attackers can forge tokens.

### Life Analogy
It's like a VIP wristband. If someone steals it, they get in. If the bouncer doesn't have a blacklist, they can't stop them until the night ends.

### Key Points
- XSS risks.
- Hard to revoke.
- Need strong secrets.
