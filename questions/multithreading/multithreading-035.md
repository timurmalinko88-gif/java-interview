---
id: multithreading-035
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Thread.join"]
tags: [databases, spring-core, multithreading, exceptions]
---

# `Thread.join()`
What does the `Thread.join()` method do? Provide a scenario where it is necessary.

---ANSWER---

The `Thread.join()` method is used to pause the execution of the *current* thread until the thread on which `join()` was called has completely finished executing (terminated). 

You can also pass a timeout parameter (e.g., `threadA.join(1000)`), which tells the current thread to wait for `threadA` to finish, but give up and move on if it takes longer than 1000 milliseconds.

**Scenario:**
Imagine an application that needs to generate a final report. The data for the report comes from three different databases. To speed things up, the main thread spawns three worker threads to fetch the data concurrently. 
However, the main thread cannot generate the final report until it has all the data. 
Therefore, the main thread will call `thread1.join()`, `thread2.join()`, and `thread3.join()`. This ensures the main thread blocks and waits for all three workers to finish before proceeding to the code that combines the data and prints the report.

- Used for synchronizing the end of thread execution.
- Can accept a timeout to prevent infinite blocking.
- Throws `InterruptedException` if the waiting thread is interrupted.

### Life Analogy
Imagine you are cooking dinner (the main thread). You ask your partner to go to the store to buy wine (Thread A). You can continue chopping vegetables, but you cannot serve dinner until the wine arrives. So, when everything else is ready, you sit on the couch and wait for them to return. Calling `partner.join()` is you sitting on the couch doing nothing until they walk back through the front door.

### Key Points
- `join()` blocks the calling thread until the target thread terminates.
