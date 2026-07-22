---
id: stream-031
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, system-design, patterns, databases, stream-api, collections]
---

# Collectors.joining()
How do you concatenate a stream of Strings into a single String, separated by a comma?

---ANSWER---

You use the `Collectors.joining()` terminal operation. It is specifically designed to concatenate elements of a `Stream<String>` into a single `String`.

It has three overloaded versions:
1. `joining()`: Concatenates the elements without any delimiter.
2. `joining(CharSequence delimiter)`: Concatenates the elements separated by the specified delimiter.
3. `joining(CharSequence delimiter, CharSequence prefix, CharSequence suffix)`: Concatenates with a delimiter, and adds a prefix at the very beginning and a suffix at the very end.

**Code Example:**
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// Output: "Alice, Bob, Charlie"
String csv = names.stream()
    .collect(Collectors.joining(", "));

// Output: "[Alice-Bob-Charlie]"
String custom = names.stream()
    .collect(Collectors.joining("-", "[", "]"));
```

*(Note: If the stream is not a `Stream<String>`, you must map the elements to Strings first, e.g., `.map(Object::toString)` or `.map(String::valueOf)`).*

### Life Analogy
`Collectors.joining` is like making a necklace. You have a pile of loose beads (the stream). The "delimiter" is the knot you tie between each bead to keep them spaced out. The "prefix" is the clasp on the left side, and the "suffix" is the clasp on the right side.

### Key Points
- `Collectors.joining()` is the standard way to merge a string stream into one string.
- It can take a delimiter, a prefix, and a suffix.
- It uses a `StringBuilder` internally, making it highly efficient.
