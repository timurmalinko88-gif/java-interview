---
id: databases-014
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 70%
source: Custom
prerequisites: ["Database Design", "2NF"]
---

# Explain Third Normal Form (3NF).
What are the rules for a database table to be in Third Normal Form (3NF)?

---ANSWER---

Third Normal Form (3NF) is the most common goal for database normalization in practical application design. It ensures that data is entirely non-redundant and depends strictly on the primary key.

For a table to be in 3NF, it must satisfy two conditions:
1.  **It must be in 2NF.**
2.  **No Transitive Dependencies:** All non-key attributes must depend *only* on the primary key, and not on any other non-key attributes.

- **Transitive Dependency:** This occurs when Column A determines Column B, and Column B determines Column C. Therefore, Column C transitively depends on Column A via Column B.
- **Rule of thumb:** "Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key."

*Example:*
Imagine a table: `Employees(EmployeeID (PK), Name, DepartmentID, DepartmentName)`
- `DepartmentID` depends on `EmployeeID` (valid).
- `DepartmentName` depends on `DepartmentID`.
- This is a transitive dependency: EmployeeID -> DepartmentID -> DepartmentName.
- To achieve 3NF, we move `DepartmentName` to a separate `Departments` table, leaving `DepartmentID` in the `Employees` table as a foreign key.

### Life Analogy
Think of a car registration document. The PK is the License Plate.
The document lists the Car Make (Toyota), Car Model (Camry), and the Manufacturer's Country (Japan).
The Country (Japan) depends on the Make (Toyota), not directly on the License Plate. 3NF says you shouldn't write "Japan" on every Toyota's registration. Keep a separate list that says "Toyota = Japan", and only put the Make on the registration.

### Key Points
- 3NF requires the table to be in 2NF.
- 3NF eliminates transitive dependencies.
- Non-key columns cannot depend on other non-key columns.
