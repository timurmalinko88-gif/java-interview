---
id: patterns-029
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Clean Code"]
---

# DRY (Don't Repeat Yourself)
What does DRY mean in software development? What are the dangers of violating this principle?

---ANSWER---

DRY stands for "Don't Repeat Yourself". It is a fundamental principle of software development aimed at reducing repetition of software patterns, replacing them with abstractions or using data normalization. 

The core idea is that every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

**Dangers of Violation (WET - Write Everything Twice):**
- **Maintenance Nightmare**: If a bug is found in duplicated code, it must be fixed in multiple places. It's easy to miss one, leading to inconsistent behavior.
- **Code Bloat**: Duplication increases the size of the codebase unnecessarily.
- **Reduced Readability**: It's harder to understand the core logic when it's scattered across multiple similar blocks of code.

### Life Analogy
Writing your home address on forms. Instead of writing it out completely 10 different times on 10 different pages of a medical intake form, it's better to write it once on the first page, and the rest of the form just references "See Page 1".

### Key Points
- Reduces code duplication.
- Centralizes logic.
- Makes maintenance and bug fixing significantly easier.
