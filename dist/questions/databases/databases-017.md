---
id: databases-017
topic: Databases
difficulty: Junior
format: Open Answer
time: 2
frequency: 90%
source: Custom
prerequisites: ["ORM", "JPA"]
tags: [oop, spring-core, databases, stream-api, memory, collections, spring-data]
---

# What is the difference between an Entity and a Table?
In the context of JPA/Hibernate, explain the conceptual difference between a Java Entity and a database Table.

---ANSWER---

While they are closely related in ORM, they exist in different paradigms.

1.  **Table:**
    - Belongs to the Relational Database paradigm.
    - It is a physical data structure consisting of rows and columns.
    - Data is stored natively using SQL types (VARCHAR, INT, DATE).
    - Relationships are defined by Foreign Keys.

2.  **Entity:**
    - Belongs to the Object-Oriented paradigm (Java).
    - It is a lightweight, persistent domain object (a POJO annotated with `@Entity`).
    - Data is stored in instance variables (fields) using Java types (String, Integer, LocalDate).
    - Relationships are defined by object references and collections (e.g., `List<Order>`).

**The Bridge:**
ORM frameworks like Hibernate act as the bridge. They map the state of an Entity (object) to a row in a Table. When you load an Entity, Hibernate reads the Table row and instantiates a Java object. When you save an Entity, Hibernate translates the object state into an SQL `INSERT` or `UPDATE` statement against the Table.

### Life Analogy
- **Table:** A filing cabinet drawer labeled "Employees" with paper forms. It's structural and physical storage.
- **Entity:** An actual employee you interact with in the office. They have behaviors and complex relationships with other people.
Hibernate is the HR clerk who reads the paper form (Table) and tells you about the employee (Entity), or takes information from the employee and files the paperwork.

### Key Points
- A Table is a relational database structure (rows/columns).
- An Entity is an object-oriented Java class mapped to a table.
- ORM bridges the gap between the two paradigms.
