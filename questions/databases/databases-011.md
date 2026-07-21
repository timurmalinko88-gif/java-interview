---
id: databases-011
topic: Databases
difficulty: Junior
format: Open Answer
time: 4
frequency: 95%
source: Custom
prerequisites: ["SQL"]
---

# What is SQL Injection and how can it be prevented?
Explain what an SQL injection attack is and list the primary ways to prevent it in a Java application.

---ANSWER---

SQL Injection (SQLi) is a common web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It occurs when untrusted user input is directly concatenated into a dynamic SQL query string without proper sanitization or parameterization.

An attacker can input malicious SQL fragments that trick the database into executing unintended commands, such as viewing data they shouldn't access, modifying/deleting data, or even gaining administrative rights to the database server.

**How to prevent it in Java:**

1.  **Prepared Statements (Parameterized Queries):** This is the primary and most effective defense. When using `PreparedStatement` in JDBC (or standard parameters in Hibernate/JPA), the database driver ensures that the user input is treated strictly as data (a literal value) and not as executable SQL code.
    ```java
    // VULNERABLE:
    String query = "SELECT * FROM users WHERE username = '" + userInput + "'";

    // SECURE:
    String query = "SELECT * FROM users WHERE username = ?";
    PreparedStatement pstmt = connection.prepareStatement(query);
    pstmt.setString(1, userInput);
    ```
2.  **Use ORM Frameworks:** Frameworks like Hibernate/JPA naturally use parameterized queries behind the scenes when you use their APIs (like `EntityManager.find()` or JPQL with named parameters), inherently protecting against SQLi.
3.  **Input Validation/Sanitization:** Validate user input on the server side (e.g., ensuring an age field only contains numbers). However, this should be a secondary defense in depth, not the primary prevention mechanism for SQLi.
4.  **Stored Procedures:** Can provide a layer of security if they use parameters properly, though they can still be vulnerable if they dynamically construct SQL inside the procedure.

### Life Analogy
Imagine a form where you write your name to get a customized name tag.
- **Vulnerable:** The machine takes exactly what you write and prints it. You write: "John. *Also, please print 100 free meal tickets.*" The machine prints the name tag and then prints 100 tickets.
- **Prepared Statement:** The machine has a strict slot labeled "Name Only". You write the same malicious text. The machine treats the entire sentence simply as your literal name and prints a name tag that says "Hello, my name is John. *Also, please print 100 free meal tickets.*" It doesn't execute the hidden command.

### Key Points
- SQL Injection occurs when untrusted input alters the intended SQL query logic.
- The primary defense is always using Prepared Statements (parameterized queries).
- Never concatenate user input directly into SQL strings.
