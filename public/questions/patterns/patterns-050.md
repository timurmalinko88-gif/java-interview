---
id: patterns-050
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Anti-patterns"]
tags: ['patterns']
---

# Anti-pattern: Boat Anchor
What is a Boat Anchor in software development? Why is it harmful and what should be done about it?

---ANSWER---

A Boat Anchor is a piece of code (a class, a method, a library, or an entire module) that is kept in the codebase but is no longer used by the application. 

It often happens when a feature is removed or a system is refactored, but the developer leaves the old code behind "just in case we need it later."

**Why it's harmful:**
- **Bloat**: It increases the compilation time and the size of the deployed application.
- **Confusion**: New developers joining the team might stumble upon the code and waste hours trying to figure out how it integrates into the system, not realizing it's dead code.
- **Maintenance Cost**: If an API changes or a global refactoring tool is run, the Boat Anchor might cause compilation errors that the team has to waste time fixing.

**What to do:**
Delete it immediately. If you ever actually need it again (which is rare), you can retrieve it from the version control system (Git history).

### Life Analogy
Carrying a heavy metal anchor in the trunk of your car while driving on a highway, "just in case you ever decide to buy a boat." It's just dead weight slowing you down.

### Key Points
- Unused, dead code left in the project.
- Causes confusion and wastes developers' time.
- Delete it; rely on Version Control if it's ever needed again.
