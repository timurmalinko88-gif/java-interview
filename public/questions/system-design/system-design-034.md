---
id: system-design-034
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["Data Structures", "Search"]
tags: [spring-core, system-design, databases, stream-api, collections]
---

# Search Engines / Inverted Index

How do Full-Text Search engines like Elasticsearch or Apache Lucene find documents so quickly? Explain the concept of an Inverted Index.

---ANSWER---

If you store text in a standard relational database (like MySQL) and want to find all documents containing the word "system", doing `WHERE content LIKE '%system%'` forces the database to do a Full Table Scan, reading every single word of every single row, which is incredibly slow.

Search engines solve this by flipping the data structure upside down using an **Inverted Index**.

**How it works:**
1. **Document Ingestion**: When a document is saved (e.g., Doc1: "System design is hard", Doc2: "Database design is fun"), the text engine runs it through an Analyzer.
2. **Tokenization**: It splits the text into words (tokens) and converts them to lowercase.
3. **Filtering**: It removes stop words (is, the, a) and applies stemming (converting "running" to "run").
4. **The Index**: It creates a dictionary where the *Words* are the Keys, and the Values are lists of *Document IDs* that contain that word.

*Example Inverted Index:*
- `system` -> [Doc1]
- `design` -> [Doc1, Doc2]
- `hard` -> [Doc1]
- `databas` -> [Doc2]
- `fun` -> [Doc2]

**Search Execution:**
If a user searches for "system design", the engine looks up `system` (`O(1)` hash lookup) to get `[Doc1]`. It looks up `design` to get `[Doc1, Doc2]`. It then performs a set intersection to find that `Doc1` is the only document containing both words. The search speed is entirely independent of how long the actual documents are.

### Life Analogy
A standard database is like reading every page of a textbook to find mentions of "Algorithm". An inverted index is the Index section at the back of the textbook. You just look up "Algorithm" (the key), and it gives you a list of page numbers (Document IDs) where that word appears.

### Key Points
- Relational databases are terrible at full-text search.
- An Inverted Index maps individual words to a list of Document IDs.
- Lookups are `O(1)` for the word, making search extremely fast regardless of document size.
