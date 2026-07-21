---
id: databases-007
topic: Databases
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["SQL"]
tags: [databases, oop, spring-core, collections]
---

# What is the difference between INNER JOIN and OUTER JOIN?
Explain how `INNER JOIN` works compared to `OUTER JOIN` (LEFT, RIGHT, FULL) in SQL relational algebra.

---ANSWER---

Joins are used to combine rows from two or more tables based on a related column between them.

1.  **INNER JOIN:**
    - Returns only the records that have matching values in **both** tables.
    - If a row in Table A does not have a corresponding match in Table B based on the join condition, that row is completely omitted from the result set.

2.  **OUTER JOIN:**
    - Returns matching records from both tables, plus unmatched records from one or both tables, filling in `NULL` values for the missing side.
    - **LEFT (OUTER) JOIN:** Returns all records from the left table, and the matched records from the right table. The result is `NULL` from the right side if there is no match.
    - **RIGHT (OUTER) JOIN:** Returns all records from the right table, and the matched records from the left table. The result is `NULL` from the left side if there is no match.
    - **FULL (OUTER) JOIN:** Returns all records when there is a match in either left or right table. Unmatched rows from both sides will appear with `NULL`s for the other side.

### Life Analogy
Imagine matching students to classes.
- **INNER JOIN:** Only show me the list of students who are actually enrolled in a class. If a student has no classes, ignore them. If a class has no students, ignore it.
- **LEFT JOIN (Students left, Classes right):** Show me a list of ALL students. If they are in a class, list it. If they aren't enrolled in anything, list the student name but put "NULL" for the class name.
- **FULL JOIN:** Show me a massive list of everything: all students and all classes. Match them where you can. If a student is classless, show them with "NULL" class. If a class is empty, show it with a "NULL" student.

### Key Points
- INNER JOIN requires matches in both tables.
- LEFT JOIN includes all rows from the first table.
- RIGHT JOIN includes all rows from the second table.
- FULL JOIN includes all rows from both tables, matching where possible.
