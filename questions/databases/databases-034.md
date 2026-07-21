---
id: databases-034
topic: Databases
difficulty: Senior
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Indexes", "Composite Indexes"]
---

# What is a Covering Index?
Explain the concept of a Covering Index and why it provides massive performance gains.

---ANSWER---

A Covering Index is a special case of index utilization where the index itself contains all the data required to satisfy a specific query.

Normally, when a database uses a non-clustered index, it finds the index key, and then uses a pointer to perform a "key lookup" (or bookmark lookup) to fetch the actual data row from the table to get the rest of the columns requested in the `SELECT` statement. This lookup is an extra I/O step.

If you create an index that includes *all* the columns referenced in your `SELECT`, `WHERE`, and `JOIN` clauses, the database engine never needs to look at the actual table data. It gets everything it needs directly from the index structure.

*Example:*
Query: `SELECT FirstName, LastName FROM Users WHERE Age > 30;`
If you have an index purely on `(Age)`, the DB finds the ages, then looks up the table for the names.
If you have a composite index on `(Age, FirstName, LastName)`, the index "covers" the query. The DB scans the index, finds ages > 30, and the names are sitting right there in the index leaf node. Zero table lookups required.

### Life Analogy
You are looking for the phone number of a local plumber in a phone book.
- **Normal Index:** You look in the index at the back under "Plumbers". It says "Go to page 45". You turn to page 45 to read the phone number. (Two steps).
- **Covering Index:** You look in a specialized "Quick Contacts" index at the back. Under "Plumbers", it lists the name AND the phone number right there. You never have to turn to page 45. (One step).

### Key Points
- An index that contains all columns needed for a query.
- Eliminates the need for expensive table lookups.
- Results in extremely fast read performance for specific queries.
