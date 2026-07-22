---
id: collections-042
topic: Collections
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Iterators"]
tags: [oop, spring-core, stream-api, multithreading, collections, exceptions]
---

# Avoiding ConcurrentModificationException
How do you safely remove elements from a collection while iterating over it to avoid `ConcurrentModificationException`?

---ANSWER---

If you need to remove elements from a standard collection during iteration in a single-threaded environment, you cannot use a `for-each` loop and call `list.remove()`. 

You have three main safe options:

1. **Use the Iterator's remove method**:
   Instead of using the collection's remove method, use an explicit `Iterator` and call its `remove()` method. The iterator knows how to safely update its internal counters (`modCount`).
   ```java
   Iterator<String> it = list.iterator();
   while (it.hasNext()) {
       if (it.next().equals("bad")) {
           it.remove(); // SAFE
       }
   }
   ```

2. **Use removeIf() (Java 8+)**:
   This is the cleanest and most modern approach. It uses a Predicate.
   ```java
   list.removeIf(item -> item.equals("bad")); // SAFE
   ```

3. **Use a concurrent collection**:
   If you use a fail-safe collection like `CopyOnWriteArrayList` or `ConcurrentHashMap`, you can safely use the collection's remove method during iteration without throwing the exception (though the iterator might not reflect the removal).

### Life Analogy
If you are painting lines on a road (iterating), and you see a pothole you want to fix (remove), you can't just call a massive construction crew (collection.remove) to tear up the road right where you are standing. You have to use the small patch kit attached to your paint cart (iterator.remove) so you don't disrupt your own progress.

### Key Points
- Do not use `collection.remove()` inside a for-each loop.
- Use `iterator.remove()` instead.
- In modern Java, prefer `collection.removeIf()`.
