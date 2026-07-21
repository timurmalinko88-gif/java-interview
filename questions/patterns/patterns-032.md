---
id: patterns-032
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Anti-patterns"]
tags: [oop, spring-core, system-design, patterns, testing, collections]
---

# Anti-pattern: God Object
What is the God Object anti-pattern? Why is it harmful and how can you refactor it?

---ANSWER---

A God Object (or Blob) is a class that controls too much and knows too much. It is characterized by having a massive number of methods, holding a vast amount of state, and lacking a clear, single purpose. 

It violates the Single Responsibility Principle (SRP) to an extreme degree.

**Why it's harmful:**
- **Unmaintainable**: Changing one small thing risks breaking unrelated functionality.
- **Untestable**: Setting up the state required to test a single method inside a God Object is incredibly difficult.
- **Merge Conflicts**: If multiple developers are working on the system, they will likely all need to modify the God Object, leading to constant Git conflicts.

**How to refactor:**
Break it down using the Facade pattern, delegation, or simply extracting related fields and methods into smaller, cohesive classes based on domains or responsibilities.

### Life Analogy
A CEO who refuses to delegate and tries to personally manage HR, Payroll, Marketing, Engineering, and Janitorial duties. They become a massive bottleneck and do a poor job at all of them.

### Key Points
- A class that does too much.
- Extreme violation of the Single Responsibility Principle.
- Hard to test and maintain.
