---
id: system-design-002
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 85%
source: Custom
prerequisites: ["REST", "HTTP", "Idempotency"]
tags: ['system-design']
---

# Idempotency in REST APIs

What does idempotency mean in the context of REST APIs? Which HTTP methods are idempotent by definition? How would you design an API to handle duplicate POST requests gracefully (e.g., in a payment processing system)?

---ANSWER---

Idempotency means that making multiple identical requests has the same effect on the server's state as making a single request. 

- **Idempotent HTTP Methods**: `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`. (Calling `PUT /users/1` multiple times updates the user to the same state).
- **Non-idempotent**: `POST`, `PATCH` (usually). (Calling `POST /payments` multiple times may result in multiple payments).

**Designing for Idempotency with POST (e.g., Payments)**:
Since `POST` is not inherently idempotent, we must implement an idempotency mechanism to handle retries (e.g., a client retrying a payment after a network timeout):
1. The client generates a unique `Idempotency-Key` (e.g., a UUID) for the operation and sends it in the HTTP header.
2. The server checks a fast datastore (like Redis) for this key.
3. If the key exists and the transaction is complete, the server returns the cached response (e.g., `200 OK`) without reprocessing.
4. If the key is new, the server processes the payment, saves the response against the idempotency key, and returns the result.

### Life Analogy
Think of an elevator button. Pressing the "Floor 5" button once has the same effect as pressing it ten times. The action of going to the 5th floor is idempotent.

### Key Points
- Idempotency ensures safety during network retries.
- GET, PUT, DELETE are idempotent; POST is not.
- Use `Idempotency-Key` headers for critical operations like payments.
