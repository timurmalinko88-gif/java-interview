---
id: patterns-040
topic: Patterns
difficulty: Junior
format: Code Review
time: 5
frequency: 95%
source: Custom
prerequisites: ["Clean Code"]
---

# Clean Code: Naming Conventions
According to Clean Code principles, what are the characteristics of good variable and method names? Provide examples of bad vs good names.

---ANSWER---

Good names in software should be intention-revealing, pronounceable, and searchable. They should tell you why it exists, what it does, and how it is used.

**Characteristics of good names:**
- **Meaningful**: Avoid single-letter variables (except for short loop counters like `i` or `j`). 
- **Pronounceable**: If you can't pronounce it, you can't discuss it with your team.
- **Searchable**: Single-letter variables or common words are hard to find using `Ctrl+F`.
- **Use Nouns for Classes/Variables** (e.g., `Customer`, `accountBalance`).
- **Use Verbs for Methods** (e.g., `calculateTotal()`, `saveToDatabase()`).

**Examples:**
*Bad:* `int d; // elapsed time in days`
*Good:* `int elapsedTimeInDays;`

*Bad:* `public void p() { ... }`
*Good:* `public void printReport() { ... }`

### Life Analogy
Labels on moving boxes. A box labeled "Misc 1" (Bad Name) tells you nothing about what's inside. You have to open it to find out. A box labeled "Kitchen: Silverware" (Good Name) tells you exactly what it is and where it belongs.

### Key Points
- Names should reveal intent.
- Avoid abbreviations and magic letters.
- Good naming reduces the need for comments.
