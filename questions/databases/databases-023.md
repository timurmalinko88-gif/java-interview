---
id: databases-023
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 90%
source: Custom
prerequisites: ["SQL"]
tags: [spring-core, memory, collections, databases]
---

# Explain UNION vs. UNION ALL.
What is the difference between the `UNION` and `UNION ALL` operators in SQL?

---ANSWER---

Both operators are used to combine the result sets of two or more `SELECT` statements into a single result set.

1.  **UNION:**
    - Combines the results and **removes duplicate rows**.
    - Because it has to identify and remove duplicates, the database engine must perform an internal sort or hash operation on the data.
    - Therefore, `UNION` is generally slower.

2.  **UNION ALL:**
    - Combines the results and **keeps all duplicate rows**.
    - It simply appends the second result set to the first.
    - Because it doesn't check for duplicates, `UNION ALL` is significantly faster than `UNION`.

*Rules for both:* The number and the order of the columns must be the same in all `SELECT` queries being combined, and the data types must be compatible.

### Life Analogy
Imagine you have a guest list for a wedding and a guest list for a rehearsal dinner, and you want a master list.
- **UNION:** You combine the lists and cross out anyone who appears twice so you only send one invitation per person. (Takes more time).
- **UNION ALL:** You literally just staple the rehearsal dinner list to the bottom of the wedding list. If Uncle Bob is on both, his name appears twice in the stack. (Very fast).

### Key Points
- UNION combines results and removes duplicates (slower).
- UNION ALL combines results and keeps duplicates (faster).
- Use UNION ALL by default unless you specifically need to eliminate duplicates.
