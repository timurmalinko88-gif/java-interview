---
id: general-003
topic: General
difficulty: Senior
format: System Design
time: 15
frequency: 85%
source: Custom
prerequisites: ["System Design", "Hashing", "Databases"]
tags: [spring-core, system-design, databases, stream-api, collections]
---

# Design a URL Shortening Service (like bit.ly)

Describe the core components, data flow, and how to generate unique short URLs without collisions.

---ANSWER---

### Architecture & Core Components:

1. **API Gateway / Load Balancer:** Distributes incoming traffic across service instances.
2. **URL Shortener Service:** Handles short-code creation requests.
3. **Redirect Service:** Accepts short keys, looks up long URLs in Redis/DB, and returns `HTTP 301` (Permanent) or `302` (Found) redirects.
4. **Database (NoSQL / RDBMS):** Stores `(short_key -> original_url)` mappings.
5. **Cache Cluster (Redis):** Caches high-frequency URL lookups to ensure sub-millisecond response times.

### Short URL Generation (Base62 Encoding):
The Base62 alphabet contains `[A-Z, a-z, 0-9]` (62 characters). A 7-character string yields $62^7 \approx 3.5 \text{ trillion}$ unique combinations.
- Generate a unique 64-bit integer ID (e.g., using a distributed ID generator like **Twitter Snowflake** or DB auto-increment).
- Convert the integer ID from Base-10 into a Base-62 string representation.
- Store the resulting string as the `short_key`. This guarantees zero collision risk without costly DB lookup checks.

### Life Analogy
A URL shortener acts like a **Coat Check at a Theater**. Instead of carrying your bulky winter coat (the long URL) into the auditorium, you hand it over and receive a small token tag `#4B9X` (the short key). Whenever you present that token tag, the attendant instantly retrieves your original coat.

### Key Points
- Use Base62 encoding on unique 64-bit IDs (Snowflake) to guarantee zero collisions.
- Use Redis in front of the database to handle heavy redirect traffic with minimal latency.
- Return `HTTP 301` for permanent caching by browsers, or `HTTP 302` if analytics tracking is required per click.

