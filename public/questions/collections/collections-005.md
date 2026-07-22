---
id: collections-005
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Data Structures"]
tags: ['collections']
---

# Set vs List
What is the difference between a `Set` and a `List` in the Java Collections Framework?

---ANSWER---

Both `Set` and `List` are interfaces that extend the `Collection` interface, but they represent different types of collections:

1. **Duplicates**: 
   - A `List` allows duplicate elements.
   - A `Set` does not allow duplicate elements. If you try to add a duplicate, the `add()` method returns `false`.

2. **Ordering**: 
   - A `List` is an ordered collection (also known as a sequence). It maintains the insertion order of elements, and you can access elements by their integer index (e.g., `get(index)`).
   - A `Set` is generally an unordered collection. It does not guarantee any specific order of its elements (like `HashSet`), though specific implementations may maintain order (like `LinkedHashSet` for insertion order or `TreeSet` for sorted order). You cannot access elements by an index.

3. **Null Elements**:
   - A `List` can contain multiple `null` elements.
   - A `Set` can contain at most one `null` element (depending on the implementation, `TreeSet` does not allow `null`).

### Life Analogy
A `List` is like a to-do list. You add items in order, and you might accidentally write "Buy milk" twice. It matters what's first and second.
A `Set` is like a collection of unique stamps. If you already have a specific stamp, getting another one doesn't add a new unique stamp to your collection. The order you keep them in doesn't necessarily matter.

### Key Points
- `List` allows duplicates and maintains order.
- `Set` prevents duplicates and does not maintain order (by default).
- `List` supports positional access via index.
