---
id: patterns-024
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["OOP", "SOLID"]
---

# Single Responsibility Principle (SRP)
What is the Single Responsibility Principle? Give an example of a violation and how to fix it.

---ANSWER---

The Single Responsibility Principle (SRP) is the "S" in SOLID. It states that a class should have one, and only one, reason to change. This means a class should only have one job or responsibility.

**Violation Example:**
A `User` class that handles both user properties (name, email) AND saving the user to the database (`saveToDatabase()`) AND sending welcome emails (`sendWelcomeEmail()`). This class has three reasons to change: business rules for users, database schema changes, and email formatting changes.

**Fix:**
Split the class into three:
1. `User`: A simple POJO containing the data.
2. `UserRepository`: Handles database persistence.
3. `EmailService`: Handles sending emails.

### Life Analogy
A Swiss Army Knife vs a Chef's Knife. A Swiss Army knife does a lot of things poorly. A chef's knife does one thing exceptionally well. In code, you want specialized tools.

### Key Points
- One reason to change per class.
- Increases cohesion.
- Makes classes easier to test and maintain.
