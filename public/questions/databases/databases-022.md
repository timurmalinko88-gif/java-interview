---
id: databases-022
topic: Databases
difficulty: Middle
format: Open Answer
time: 3
frequency: 75%
source: Custom
prerequisites: ["SQL"]
tags: ['databases']
---

# Primary Key vs. Candidate Key vs. Super Key.
Explain the differences between a Super Key, a Candidate Key, and a Primary Key in relational database design.

---ANSWER---

These terms describe how we uniquely identify rows in a table, forming a hierarchy.

1.  **Super Key:**
    - Any combination of columns that uniquely identifies a row in a table.
    - It can contain extra, unnecessary columns.
    - *Example:* In an Employee table, (EmployeeID, Name) is a Super Key. (EmployeeID, SocialSecurityNumber, Department) is also a Super Key.

2.  **Candidate Key:**
    - A minimal Super Key.
    - It uniquely identifies a row, and if you remove any column from this key, it will no longer uniquely identify the row.
    - A table can have multiple Candidate Keys.
    - *Example:* `EmployeeID` is a Candidate Key. `SocialSecurityNumber` is also a Candidate Key.

3.  **Primary Key:**
    - The specific Candidate Key that the database designer *chooses* to be the main identifier for the table.
    - There can be only ONE Primary Key per table.
    - It cannot contain NULLs.
    - *Example:* The designer selects `EmployeeID` to be the Primary Key because it's numeric and less likely to change than an SSN. (The unused candidate keys, like SSN, can then be enforced using `UNIQUE` constraints).

### Life Analogy
Imagine identifying a specific car in a parking lot.
- **Super Key:** "The red Toyota Camry with license plate ABC-123 parked in spot 5." (Identifies it, but has too much info).
- **Candidate Key:** You have two options that perfectly identify the car with minimum info: "License plate ABC-123" OR "VIN number 987654321". Both are candidates.
- **Primary Key:** The parking attendant decides to strictly use the License Plate number to track cars in their system.

### Key Points
- Super Key: Any unique combination of columns.
- Candidate Key: A minimal Super Key (no extra columns).
- Primary Key: The single Candidate Key chosen to identify the table rows.
