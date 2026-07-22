---
id: general-041
topic: General
difficulty: Junior
format: System Design
time: 10
frequency: 85%
source: Custom
prerequisites: ["Basics", "Collections"]
tags: [oop, spring-core, system-design, stream-api, jvm, memory, collections]
---

# Primitive vs Wrapper Types in Data Structures
You are designing a high-frequency trading application where millions of numeric values need to be stored and processed rapidly. A junior developer suggests using an `ArrayList<Double>` to store the prices. What are the performance implications of this choice regarding primitive vs wrapper types, and what would you recommend instead?

---ANSWER---

**Performance Implications:**
In Java, `double` is a primitive type, while `Double` is a wrapper class (an Object).
1. **Memory Overhead:** A primitive `double` takes exactly 8 bytes of memory. A `Double` object, however, takes significantly more memory (typically 24 bytes on a 64-bit JVM) because of the object header and padding. Storing millions of `Double` objects in an `ArrayList` will consume vast amounts of memory compared to primitives.
2. **Performance (Autoboxing/Unboxing):** Whenever you add a `double` to an `ArrayList<Double>`, Java automatically converts it to a `Double` object (Autoboxing). When you read it, it converts it back (Unboxing). This continuous object creation puts immense pressure on the Garbage Collector, causing latency spikes which are unacceptable in high-frequency trading.
3. **Memory Locality:** `ArrayList` stores an array of *references* to objects scattered across the heap. Primitives in an array are stored contiguously, making CPU cache access much faster.

**Recommendation:**
Instead of `ArrayList<Double>`, use a primitive array `double[]`. If dynamic resizing is needed, use a specialized primitive collection library like Eclipse Collections, Fastutil, or Trove (e.g., `DoubleArrayList`).

### Life Analogy
Primitives are like carrying exact change in your pocket (fast, lightweight). Wrapper classes are like putting every single coin into its own individual velvet jewelry box before putting it in your pocket (Autoboxing). If you have millions of coins, the boxes will take up all the room in your house, and it will take you forever to open them all up to count your money.

### Key Points
- Wrapper classes add significant memory overhead compared to primitives.
- Autoboxing/Unboxing creates hidden object allocations and Garbage Collection pressure.
- Java standard Collections only support Objects (Wrappers).
- For high-performance/large-dataset scenarios, prefer primitive arrays or specialized primitive collection libraries.
