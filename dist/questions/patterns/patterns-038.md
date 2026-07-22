---
id: patterns-038
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Clean Code", "Anti-patterns"]
tags: [spring-core, memory, patterns]
---

# Anti-pattern: Premature Optimization
Why is Premature Optimization considered the "root of all evil" in programming?

---ANSWER---

Premature Optimization occurs when a developer spends time making code run faster or use less memory before ensuring that the code is correct, readable, and that the performance bottleneck is actually located there.

Donald Knuth famously said: "Premature optimization is the root of all evil."

**Why it's harmful:**
1. **Sacrifices Readability**: Highly optimized code (e.g., bitwise operations instead of readable math, or manual memory unrolling) is often much harder to read and maintain.
2. **Wasted Effort**: Most parts of an application execute very quickly and aren't bottlenecks. Optimizing them yields unnoticeable gains.
3. **Delays Delivery**: Time spent optimizing unknown bottlenecks is time not spent building features.

**Best Practice:**
Write clean, correct code first. Then, run a profiler to find the *actual* bottlenecks and optimize only those specific hot spots.

### Life Analogy
Putting a huge racing spoiler and a nitrous oxide system on a car before you've even made sure the engine starts and the brakes work. 

### Key Points
- Optimize only when necessary and guided by profiling data.
- Readability and correctness come before performance.
- Focus optimizations on actual bottlenecks.
