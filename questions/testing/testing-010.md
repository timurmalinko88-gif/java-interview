---
id: testing-010
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["QA"]
---

# QA Test Pyramid

Explain the Test Automation Pyramid.

---ANSWER---

The Test Pyramid is a concept representing the ideal distribution of tests in a project:
1. **Base (Unit Tests):** The majority of tests. Fast, isolated, and cheap to write/maintain.
2. **Middle (Integration Tests):** Fewer than unit tests. Test interactions between components.
3. **Top (End-to-End/UI Tests):** The fewest tests. Slow, brittle, and expensive. Test the whole system from the user's perspective.

### Life Analogy
Like a healthy diet food pyramid: you should have a lot of grains/vegetables (unit tests) and very few sweets (E2E tests).

### Key Points
- Lots of Unit tests.
- Moderate Integration tests.
- Few E2E tests.
