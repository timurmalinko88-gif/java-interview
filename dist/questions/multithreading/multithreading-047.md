---
id: multithreading-047
topic: Multithreading
difficulty: Middle
format: Open Answer
time: 10
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "CompletableFuture"]
tags: ['multithreading']
---

# `CompletableFuture`
Java 8 introduced `CompletableFuture`. How does it improve upon the older `Future` interface?

---ANSWER---

`CompletableFuture` is a massive upgrade over the classic `Future` interface because it introduces **non-blocking, reactive, and composable** asynchronous programming.

**Improvements over `Future`:**
1. **Non-blocking Callbacks**: With an old `Future`, the only way to get the result was to call the blocking `.get()` method. With `CompletableFuture`, you can attach callbacks like `.thenApply()`, `.thenAccept()`, or `.thenRun()`. When the future completes, it automatically executes the callback asynchronously, without blocking the main thread.
2. **Composition**: You can chain multiple asynchronous operations together. For example, fetch user data asynchronously, *then* fetch their orders asynchronously (`thenCompose`), *then* combine that data.
3. **Combining**: You can wait for multiple futures to complete (`CompletableFuture.allOf()`) or wait for the fastest one (`CompletableFuture.anyOf()`) without writing complex `CountDownLatch` logic.
4. **Manual Completion**: Unlike a standard `Future`, a `CompletableFuture` can be explicitly completed by the developer from any thread by calling `.complete(result)` or `.completeExceptionally(ex)`.

`CompletableFuture` is like getting a restaurant buzzer. You can go sit down, talk to your friends, or read a book. You attach a "callback" to the buzzer: "When this buzzes, I will go pick up the food." You are free to do other things, and the buzzer handles the notification asynchronously.

- Allows chaining and composing asynchronous tasks.
- Can be manually completed.
- Eliminates the need for the blocking `Future.get()` method.

### Life Analogy
The old `Future` is like ordering food at a restaurant and standing at the counter refusing to move until the food is handed to you (blocking).

### Key Points
- `CompletableFuture` supports non-blocking callbacks (`thenApply`, `thenAccept`).
