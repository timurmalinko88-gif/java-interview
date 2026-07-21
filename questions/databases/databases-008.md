---
id: databases-008
topic: Databases
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["SQL"]
tags: [spring-core, databases, stream-api, memory, collections, exceptions]
---

# Explain WHERE vs. HAVING vs. GROUP BY.
In a SQL query, what is the sequence and purpose of `WHERE`, `GROUP BY`, and `HAVING` clauses?

---ANSWER---

These clauses are used to filter and aggregate data, but they operate at different stages of the query execution lifecycle.

1.  **WHERE:**
    - Operates **before** data is grouped.
    - Used to filter individual rows coming directly from the tables based on specified conditions.
    - You cannot use aggregate functions (like `SUM`, `COUNT`, `AVG`) in a `WHERE` clause.
    - Example: `SELECT department, salary FROM employees WHERE salary > 50000;`

2.  **GROUP BY:**
    - Operates **after** the `WHERE` clause.
    - Groups the filtered rows into summary rows based on one or more columns. It creates a single row for each unique combination of the grouped columns.
    - Typically used in conjunction with aggregate functions to perform calculations on each group.
    - Example: `... GROUP BY department;`

3.  **HAVING:**
    - Operates **after** the `GROUP BY` clause.
    - Used to filter the aggregated groups created by `GROUP BY`.
    - You **can** (and usually do) use aggregate functions in a `HAVING` clause.
    - Example: `... HAVING AVG(salary) > 60000;`

**Execution Order Summary:**
1. Retrieve rows (FROM/JOIN).
2. Filter individual rows (`WHERE`).
3. Group the remaining rows (`GROUP BY`).
4. Calculate aggregates.
5. Filter the aggregated groups (`HAVING`).

### Life Analogy
Imagine processing a stack of employee files to find high-earning departments.
- **WHERE:** First, you throw away files for anyone who works part-time. You are filtering individual people before doing any math.
- **GROUP BY:** Now you take the remaining files and sort them into piles on your desk based on their Department (HR, IT, Sales).
- **HAVING:** You calculate the average salary for each pile. You throw away any pile where the average is less than $60,000. You are filtering the grouped piles, not individual files.

### Key Points
- WHERE filters rows before grouping.
- GROUP BY aggregates rows into subsets.
- HAVING filters the aggregated subsets after grouping.
