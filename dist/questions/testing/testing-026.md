---
id: testing-026
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["REST"]
tags: ['testing']
---

# REST API Versioning

What are the common ways to version a REST API?

---ANSWER---

1. URL path (e.g., `/api/v1/users`).
2. Query parameter (e.g., `/api/users?version=1`).
3. Custom Header (e.g., `X-API-Version: 1`).
4. Content Negotiation / Accept Header (e.g., `Accept: application/vnd.myapi.v1+json`).

### Life Analogy
It's like releasing a new edition of a book. You can put the edition number on the cover (URL), on a sticker (Header), or inside the preface (Accept header).

### Key Points
- URL path is most common.
- Accept header is the most RESTful.
