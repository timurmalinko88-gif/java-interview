---
id: multithreading-029
topic: Multithreading
difficulty: Middle
format: Code Review
time: 7
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Future", "ExecutorService"]
---

# `Future.get()` Blocking Main Thread
Review the following code. The developer wanted to execute three tasks in parallel to speed up execution. Did they succeed? If not, why, and how would you fix it?

```java
public class FutureReview {
    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        long start = System.currentTimeMillis();
        
        String result1 = executor.submit(new SlowTask()).get();
        String result2 = executor.submit(new SlowTask()).get();
        String result3 = executor.submit(new SlowTask()).get();
        
        System.out.println("Time: " + (System.currentTimeMillis() - start));
        executor.shutdown();
    }
}
```
*(Assume `SlowTask` implements `Callable<String>` and sleeps for 2 seconds).*

---ANSWER---

The developer **did not succeed** in parallelizing the tasks. The code will execute sequentially and take approximately 6 seconds.

**Why:**
The `executor.submit()` method immediately returns a `Future` object representing the pending result of the task. However, the developer immediately calls `.get()` on that `Future`. 
The `get()` method is **blocking**. It halts the main thread until the computation is complete and the result is available. 
Therefore, the first task is submitted, and the main thread blocks for 2 seconds until it finishes. Only then is the second task submitted, blocking for another 2 seconds, and so on.

**Fix:**
To achieve parallelism, you must separate the *submission* of tasks from the *retrieval* of their results. Submit all tasks first, store their `Future` references, and then call `get()` on them.

```java
Future<String> future1 = executor.submit(new SlowTask());
Future<String> future2 = executor.submit(new SlowTask());
Future<String> future3 = executor.submit(new SlowTask());

// All tasks are now running in parallel.

String result1 = future1.get();
String result2 = future2.get();
String result3 = future3.get();
```
This fixed version will take approximately 2 seconds, as the tasks sleep concurrently.

The fixed code is like placing orders for coffee, a sandwich, and a muffin all at once with three different cashiers, and then waiting at the pickup counter for all three to arrive.

- Calling `get()` immediately after `submit()` completely negates parallelism.
- Submit all tasks first, then retrieve results.

### Life Analogy
The broken code is like ordering a coffee, standing at the counter refusing to move until you get it, and *only then* ordering a sandwich, waiting, and *only then* ordering a muffin.

### Key Points
- `Future.get()` is a blocking operation.
