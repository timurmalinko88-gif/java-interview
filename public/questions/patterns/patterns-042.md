---
id: patterns-042
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Anti-patterns"]
tags: [spring-core, oop, memory, patterns]
---

# Anti-pattern: Copy-Paste Programming
What is Copy-Paste Programming? Why is it dangerous and how do you resolve it?

---ANSWER---

Copy-Paste Programming occurs when a developer builds a system by copying snippets of code (either from StackOverflow, internal legacy code, or even within the same file) and pasting them wherever similar functionality is needed, often with minor tweaks.

It directly violates the DRY (Don't Repeat Yourself) principle.

**Why it is dangerous:**
- **Bug Propagation**: If the original snippet contained a hidden bug, you just multiplied that bug across your entire codebase.
- **Maintenance Cost**: If the business logic needs to change, you have to find and update every single copied instance. Missing even one leads to inconsistent behavior.
- **Bloat**: It unnecessarily increases the size of the codebase.

**How to resolve:**
Refactor the duplicated code into a single, reusable function, method, or class. Parameterize the minor differences so that the single source of truth can handle the variations.

### Life Analogy
Photocopying a contract 100 times, but then realizing you spelled the company name wrong. Now you have to manually erase and rewrite the name on 100 separate sheets of paper, instead of fixing the original template and reprinting.

### Key Points
- Violates the DRY principle.
- Spreads bugs and makes maintenance a nightmare.
- Resolve by extracting reusable methods.
