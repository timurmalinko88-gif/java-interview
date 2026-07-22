---
id: stream-020
topic: Stream API
difficulty: Junior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# Reusing Streams
Review the following code. Will it execute successfully? If not, what exception is thrown and why?

```java
Stream<String> names = Stream.of("Alice", "Bob", "Charlie");

long count = names.filter(name -> name.startsWith("A")).count();
System.out.println("A names: " + count);

long bCount = names.filter(name -> name.startsWith("B")).count();
System.out.println("B names: " + bCount);
```

---ANSWER---

No, the code will not execute successfully. It will throw an `IllegalStateException` on the second `.filter()` call. 

**Exception Message:** `java.lang.IllegalStateException: stream has already been operated upon or closed`.

**Reason:**
A Java `Stream` cannot be reused or consumed more than once. When a terminal operation (in this case, `count()`) is invoked on a stream, the stream pipeline is executed, the elements are consumed, and the stream is considered "closed".

Attempting to invoke any further intermediate or terminal operations on a closed stream reference will immediately result in an `IllegalStateException`.

**Solution:**
To process the same data multiple times, you must create a new Stream from the original data source each time:
```java
List<String> namesList = Arrays.asList("Alice", "Bob", "Charlie");

long count = namesList.stream().filter(name -> name.startsWith("A")).count();
long bCount = namesList.stream().filter(name -> name.startsWith("B")).count();
```
*(Alternatively, use `Supplier<Stream<String>>` to lazily generate streams).*

### Life Analogy
A Stream is like a lit fuse on a firework, or water flowing down a river. Once the water flows over a waterfall (terminal operation), you cannot ask *that specific water* to flow over another waterfall upstream. You must get new water (create a new stream from the source) if you want to run the process again.

### Key Points
- Streams are strictly single-use constructs.
- Invoking a terminal operation consumes and closes the stream.
- Trying to reuse a closed stream throws `IllegalStateException`.
- Always generate a new stream from the underlying Collection or Supplier if multiple passes are needed.
