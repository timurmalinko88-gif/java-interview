---
id: patterns-044
topic: Patterns
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Clean Code"]
tags: ['patterns']
---

# Clean Code: Functions
According to Clean Code, what are the two golden rules for writing functions (methods) in terms of size and arguments?

---ANSWER---

According to Robert C. Martin (Uncle Bob), the rules for functions are:

1. **Size**: The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that. Ideally, a function should be no longer than 20 lines. It should do exactly one thing, do it well, and do it only. This aligns with the Single Responsibility Principle at the method level.

2. **Arguments**: The ideal number of arguments for a function is zero (niladic). Next is one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible. More than three (polyadic) requires very special justification and shouldn't be used anyway. 
If a function requires more than three arguments, some of those arguments should likely be wrapped into a cohesive object (e.g., passing a `DateRange` object instead of `startDate` and `endDate`).

### Life Analogy
Giving instructions. If you tell someone: "Go to the store, buy milk, drop off the dry cleaning, pick up the kids, and cook dinner" (a massive function with many responsibilities), they will likely forget something or mess it up. Give one simple, clear instruction at a time.

### Key Points
- Functions should be very small.
- A function should do exactly ONE thing.
- Keep the number of arguments to an absolute minimum (0-2 ideally).
