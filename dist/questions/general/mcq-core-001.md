---
id: mcq-core-001
topic: General
difficulty: Junior
format: MCQ
tags: ['string']
---
Why is the String class immutable in Java?

A. To ensure thread safety
B. To allow caching of the hash code
C. For security (e.g., use as database connection parameters)
D. All of the above

---ANSWER---
**Correct answer: D (All of the above)**

### Key Points
- The immutability of `String` makes it an ideal candidate as a key in `HashMap`, allows safe use in a multithreaded environment, and protects against modification of critical parameters.
