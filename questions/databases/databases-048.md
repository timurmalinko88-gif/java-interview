---
id: databases-048
topic: Databases
difficulty: Junior
format: Open Answer
time: 4
frequency: 95%
source: Custom
prerequisites: ["JPA"]
---

# Basic JPA Annotations.
Briefly describe the purpose of these core JPA annotations: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, and `@Column`.

---ANSWER---

These annotations map Java classes to relational database structures.

1.  **`@Entity`:**
    - Marks a Java class as a persistent entity. It tells the JPA provider (like Hibernate) that instances of this class should be mapped to a database table.
2.  **`@Table`:**
    - Optional. Specifies the exact name of the database table that the entity maps to. If omitted, the table name defaults to the class name.
3.  **`@Id`:**
    - Mandatory for every entity. Marks a specific field as the Primary Key of the entity, uniquely identifying each record.
4.  **`@GeneratedValue`:**
    - Used in conjunction with `@Id`. Instructs the database to automatically generate the primary key value (e.g., via auto-increment or a sequence) when a new record is inserted.
5.  **`@Column`:**
    - Optional. Maps a specific field to a database column. Used to customize the column name (if different from the field name), length, nullable status, or unique constraints. If omitted, the column name defaults to the field name.

### Life Analogy
Think of a name tag system for a conference.
- **`@Entity`:** The blank sticker that says "Hello, I am a participant." It signifies this is a tracked object.
- **`@Table`:** The specific color of the sticker (e.g., Blue for "Java Developers").
- **`@Id`:** The unique barcode printed on the bottom of the sticker.
- **`@GeneratedValue`:** The machine that automatically prints the next sequential barcode when a new person arrives.
- **`@Column`:** The lines on the sticker that dictate where to write the First Name and Last Name.

### Key Points
- `@Entity`: Marks a class as persistent.
- `@Id`: Defines the primary key.
- `@GeneratedValue`: Auto-generates IDs.
- `@Table` / `@Column`: Customize table/column names and properties.
