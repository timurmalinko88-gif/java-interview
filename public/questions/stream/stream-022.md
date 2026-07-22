---
id: stream-022
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Stream API"]
tags: [spring-core, stream-api, collections, exceptions]
---

# skip() and limit()
Explain the purpose of `skip()` and `limit()` operations in Java Streams. Are they stateful or stateless? How do they behave when used together for pagination?

---ANSWER---

Both `skip()` and `limit()` are intermediate operations used to truncate or slice a stream. They are **stateful** operations because they need to maintain a counter of how many elements they have seen so far.

**`limit(n)`:**
- Truncates the stream to be no longer than `n` elements.
- It is a short-circuiting operation. Once `n` elements are passed downstream, the stream stops processing upstream elements.

**`skip(n)`:**
- Discards the first `n` elements of the stream. After skipping `n` elements, it passes the remaining elements downstream.
- It is not short-circuiting.

**Usage for Pagination:**
They are commonly chained together to implement pagination (fetching a specific "page" of results from a dataset). Order matters: you generally skip before you limit.

Example: Fetching Page 3, where each page has 10 items (skipping the first 20 items, taking the next 10):
```java
List<String> page3 = allItems.stream()
    .skip(20)
    .limit(10)
    .collect(Collectors.toList());
```

### Life Analogy
Imagine a deck of 52 cards.
`skip(5)` means you take the top 5 cards and throw them in the trash, keeping the rest of the deck.
`limit(5)` means you take the top 5 cards and keep them, throwing the rest of the deck in the trash.
To get cards 6-10 (a "page"), you first `skip(5)`, then `limit(5)` from the remainder.

### Key Points
- `skip()` drops the first N elements.
- `limit()` keeps only the first N elements and short-circuits.
- Both are stateful intermediate operations.
- Combined, they are heavily used for pagination logic.
