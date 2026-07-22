---
id: patterns-041
topic: Patterns
difficulty: Junior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Clean Code"]
tags: [oop, spring-core, multithreading, patterns]
---

# Clean Code: Comments
What is the Clean Code philosophy regarding code comments? When are comments considered bad, and when are they acceptable?

---ANSWER---

The Clean Code philosophy states that comments are often a sign of failure to express yourself in code. If you need a comment to explain what a block of code does, it usually means the code itself is not readable enough.

**When Comments are Bad:**
- **Redundant Comments**: Explaining the obvious (e.g., `i++; // increment i`).
- **Commented-out Code**: Just delete it. Version control (Git) remembers it for you.
- **Journal Comments**: Adding a comment log of changes at the top of a file (Git does this better).
- **Excuse Comments**: "This is a hack, will fix later."

**When Comments are Acceptable (Good Comments):**
- **Legal/Copyright Comments**: Required by corporate policy.
- **Warning of Consequences**: "Don't run this on production, it deletes the database."
- **Explanation of Intent**: Explaining *why* a decision was made, especially if it looks counter-intuitive, not *what* the code does.
- **JavaDocs for Public APIs**: Documenting a public library interface for consumers.

### Life Analogy
A joke. If you have to explain the joke, it wasn't a very good joke. If you have to heavily comment your code to explain what it does, it's not very clean code.

### Key Points
- Code should be self-documenting via good naming.
- Don't use comments to make up for bad code.
- Delete commented-out code.
