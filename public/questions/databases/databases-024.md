---
id: databases-024
topic: Databases
difficulty: Middle
format: Open Answer
time: 3
frequency: 60%
source: Custom
prerequisites: ["SQL"]
tags: [databases, testing, spring-core, collections]
---

# What is a CROSS JOIN?
Explain what a CROSS JOIN is in SQL and what kind of result it produces.

---ANSWER---

A `CROSS JOIN` (also known as a Cartesian product) returns the combination of every row from the first table with every row from the second table.

Unlike an `INNER JOIN` or `OUTER JOIN`, a `CROSS JOIN` does not require a join condition (no `ON` clause).

**Result size:**
If Table A has *M* rows and Table B has *N* rows, the resulting set will have **M * N** rows.

**When to use it:**
It is rarely used in standard business logic because it generates massive amounts of data. However, it can be useful for:
1.  Generating test data (combining lists of first names and last names).
2.  Creating comprehensive grids (e.g., combining a table of 12 months with a table of 5 regions to ensure a report has a row for every month-region combination, even if sales data is null).

*Syntax:* `SELECT * FROM table1 CROSS JOIN table2;`

### Life Analogy
Imagine a restaurant menu.
Table A is "Ice Cream Flavors" (Vanilla, Chocolate).
Table B is "Toppings" (Sprinkles, Fudge, Cherry).
A CROSS JOIN generates every possible combination for a sundae:
- Vanilla + Sprinkles
- Vanilla + Fudge
- Vanilla + Cherry
- Chocolate + Sprinkles
- Chocolate + Fudge
- Chocolate + Cherry
(2 flavors * 3 toppings = 6 combinations).

### Key Points
- A CROSS JOIN produces a Cartesian product.
- It pairs every row in Table A with every row in Table B.
- Resulting row count is Rows(A) * Rows(B).
- It does not use an `ON` clause.
