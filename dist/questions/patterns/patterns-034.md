---
id: patterns-034
topic: Patterns
difficulty: Junior
format: Code Review
time: 5
frequency: 95%
source: Custom
prerequisites: ["Clean Code"]
tags: ['patterns']
---

# Anti-pattern: Magic Numbers / Magic Strings
What are Magic Numbers and Magic Strings? Why are they considered bad practice and how do you resolve them in Java?

---ANSWER---

Magic Numbers or Magic Strings are hardcoded values appearing directly in the source code without any explanation or context.

For example:
`if (status == 2) { ... }` or `calculateDiscount(price, 0.15);`

**Why they are bad:**
1. **Lack of meaning**: A developer reading the code doesn't know what `2` or `0.15` represents.
2. **Maintenance nightmare**: If the value `2` needs to change to `3`, you have to find and replace it everywhere in the codebase, risking accidentally replacing a `2` that meant something entirely different (like a loop index).

**How to resolve in Java:**
Extract them into named constants (`public static final` variables) or `Enums`.
`if (status == Status.SHIPPED) { ... }`
`calculateDiscount(price, WINTER_SALE_DISCOUNT);`

### Life Analogy
A recipe that says "Add the powder to the liquid". Which powder? Which liquid? It's much better to say "Add the Flour to the Water".

### Key Points
- Hardcoded, unexplained values in code.
- Reduces readability and increases maintenance difficulty.
- Fix by extracting to named constants or Enums.
