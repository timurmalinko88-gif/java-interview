---
id: system-design-033
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 80%
source: Custom
prerequisites: ["API Design", "Databases"]
tags: [spring-core, system-design, databases, spring-mvc, collections, exceptions]
---

# API Pagination (Offset vs Cursor)

When designing a REST API that returns a list of millions of records, you must paginate the results. Compare Offset-based pagination with Cursor-based pagination. What are the performance implications?

---ANSWER---

**1. Offset-based Pagination:**
- *How it works*: The client requests a specific page using `limit` and `offset` (e.g., `GET /users?limit=10&offset=20`). The DB uses `SELECT * FROM users LIMIT 10 OFFSET 20`.
- *Pros*: Very easy to implement. Allows the user to jump straight to a specific page (e.g., Page 5).
- *Cons (Performance)*: As the offset grows, performance degrades terribly. `OFFSET 1000000` requires the database to scan and count 1,000,000 rows, only to throw them away and return the next 10.
- *Cons (Inconsistency)*: If a new item is inserted at the top of the list while the user is paging, items will shift down, causing the user to see duplicate items on the next page.

**2. Cursor-based Pagination:**
- *How it works*: Instead of a row count (offset), you use a pointer (cursor) to a specific row, usually the ID or a timestamp of the last item on the previous page. (e.g., `GET /users?limit=10&after_id=12345`). The DB uses `SELECT * FROM users WHERE id > 12345 LIMIT 10`.
- *Pros (Performance)*: Highly scalable. If `id` is indexed, the DB jumps directly to `12345` via the B-Tree index in `O(log N)` time. It doesn't matter if it's the 10th row or the 10-millionth row; it's always fast.
- *Pros (Consistency)*: Immune to data shifting. If new items are inserted, the cursor still points to the exact same place in the list.
- *Cons*: Cannot jump to a specific page (no "Page 5" button, only "Next/Prev"). Harder to implement if sorting by non-unique columns.

### Life Analogy
Offset is like finding a specific quote in a book by saying "Start at the beginning and count 5,000 sentences." It's slow and prone to errors if sentences are added. Cursor is like putting a bookmark in the book. Next time you read, you instantly open to the bookmark.

### Key Points
- Offset pagination is easy but performs terribly at scale (database must scan and skip rows).
- Cursor pagination is performant (uses indexes) and consistent, making it the industry standard for infinite scrolling (Twitter, Facebook).
