---
id: testing-008
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["JWT"]
tags: ['testing']
---

# JWT Structure

What are the three parts of a JSON Web Token (JWT)?

---ANSWER---

A JWT consists of three parts separated by dots (`.`):
1. **Header:** Contains token type and hashing algorithm.
2. **Payload:** Contains the claims (user data, expiration).
3. **Signature:** Used to verify that the token wasn't altered in transit.

### Life Analogy
A JWT is like a driver's license in a tamper-proof plastic sleeve. You can read the information on it (Payload), but you can't alter it without breaking the seal (Signature).

### Key Points
- Header, Payload, Signature.
- Base64Url encoded.
- Stateless authentication.
