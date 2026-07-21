---
id: collections-025
topic: Collections
difficulty: Junior
format: Code Review
time: 5
frequency: 75%
source: Custom
prerequisites: ["Data Structures"]
tags: [spring-core, stream-api, memory, exceptions, collections]
---

# Collections.unmodifiableCollection
What happens if you modify the underlying collection of a `Collections.unmodifiableList`?

---ANSWER---

The `Collections.unmodifiableList(list)` method returns a read-only "view" of the provided list. 

If you try to call mutative methods on the *returned view* (like `add()`, `set()`, `remove()`), it will throw an `UnsupportedOperationException`.

**However**, this is just a wrapper view. It does not create a copy of the list. If you maintain a reference to the **original list** and modify it, those changes **will be visible** in the unmodifiable view.

Example:
```java
List<String> original = new ArrayList<>();
original.add("A");
List<String> unmodifiable = Collections.unmodifiableList(original);

// unmodifiable.add("B"); // Throws UnsupportedOperationException
original.add("B");        // Succeeds
System.out.println(unmodifiable.size()); // Prints 2, because the underlying list changed!
```

To create a truly immutable list that cannot be changed from anywhere, you should use `List.copyOf(original)` (introduced in Java 10) or create a copy before wrapping it.

### Life Analogy
`Collections.unmodifiableList` is like putting a "Do Not Touch" glass display case over a museum exhibit. Visitors (the code using the unmodifiable view) cannot touch the items. However, the museum curator (the code holding the original list reference) has a key to the back door and can easily swap out the items while the visitors watch.

### Key Points
- Returns a read-only view, not an immutable copy.
- Mutating the view throws `UnsupportedOperationException`.
- Mutating the original collection is allowed and the changes reflect in the view.
