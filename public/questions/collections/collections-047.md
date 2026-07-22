---
id: collections-047
topic: Collections
difficulty: Junior
format: Code Review
time: 5
frequency: 40%
source: Custom
prerequisites: ["Arrays"]
tags: [oop, spring-core, stream-api, jvm, memory, collections]
---

# Arrays.copyOf vs System.arraycopy
What is the difference between `Arrays.copyOf()` and `System.arraycopy()`?

---ANSWER---

Both methods are used to copy elements from one array to another, but they operate at different levels of abstraction.

1. **`System.arraycopy()`**:
   - It is a native method (implemented in C/C++ by the JVM), making it extremely fast.
   - It requires you to pre-allocate the destination array before calling the method.
   - You must specify the source array, source starting position, destination array, destination starting position, and the number of elements to copy. It's powerful but verbose.
   - Usage: `System.arraycopy(src, 0, dest, 0, length);`

2. **`Arrays.copyOf()`**:
   - It is a utility method in the `java.util.Arrays` class.
   - It is easier to use because it internally allocates a brand-new array of the requested size, copies the elements, and returns the new array.
   - Internally, `Arrays.copyOf()` actually calls `System.arraycopy()` to perform the copying.
   - Usage: `int[] newArray = Arrays.copyOf(src, newLength);`

### Life Analogy
`System.arraycopy` is like moving furniture yourself. You have to rent the truck, drive to the new house, and place the couch exactly in the right spot. `Arrays.copyOf` is like hiring a moving company. You just tell them "move my stuff into a 3-bedroom house", and they buy the house and move the stuff for you (though they still use the same trucks internally).

### Key Points
- `System.arraycopy` is a fast native method but requires pre-allocating the destination.
- `Arrays.copyOf` allocates a new array for you and returns it.
- `Arrays.copyOf` delegates to `System.arraycopy` internally.
