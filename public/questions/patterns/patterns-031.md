---
id: patterns-031
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Clean Code"]
tags: ['patterns']
---

# YAGNI (You Aren't Gonna Need It)
Explain the YAGNI principle. How does it prevent over-engineering?

---ANSWER---

YAGNI stands for "You Aren't Gonna Need It". It is a principle from Extreme Programming (XP) that states a programmer should not add functionality until deemed necessary.

Developers often try to anticipate future requirements and build complex abstractions, extra database columns, or highly configurable systems for use cases that might happen "someday". YAGNI argues against this because:
1. **Wasted Time**: You spend time building, testing, and documenting features that may never be used.
2. **Added Complexity**: The extra code makes the system harder to understand and maintain right now.
3. **Wrong Guesses**: Even if the feature is eventually needed, the requirements will likely have changed, meaning the code you wrote ahead of time is wrong anyway.

### Life Analogy
Packing for a weekend trip to a sunny beach. YAGNI means you don't pack a heavy snow coat "just in case an unprecedented blizzard hits". It just weighs down your suitcase unnecessarily.

### Key Points
- Do not code for hypothetical future requirements.
- Keeps the codebase lean and maintainable.
- Focus on what is needed right now.
