---
id: multithreading-022
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "Race Conditions"]
---

# Race Conditions
What is a race condition in multithreading? Provide a simple conceptual example.

---ANSWER---

A **race condition** occurs when two or more threads can access shared data and try to change it at the same time. Because the scheduling algorithm can swap between threads at any time, the threads are "racing" to access/change the data. The final value of the shared data depends on the unpredictable sequence in which the threads execute, leading to inconsistent or incorrect results.

**Conceptual Example:**
Consider a shared banking account with a balance of $100.
Thread A and Thread B both try to withdraw $50 simultaneously.

The withdrawal process involves three steps:
1. Check balance ($100).
2. Subtract $50.
3. Update balance.

If the threads interleave poorly:
- Thread A checks the balance ($100).
- Thread B checks the balance ($100).
- Thread A subtracts $50 and updates the balance to $50.
- Thread B subtracts $50 from its *read* value of $100 and updates the balance to $50.

Even though $100 total was withdrawn, the final balance is $50 instead of $0. This is a "Check-Then-Act" race condition. Another common type is "Read-Modify-Write" (like `count++`).

Race conditions are fixed by synchronizing the critical section of code using locks (`synchronized`), atomic variables, or other concurrency control mechanisms.

- The outcome depends on thread scheduling (interleaving).
- Common patterns: Check-Then-Act and Read-Modify-Write.
- Solved by synchronization (locks, atomics).

### Life Analogy
Imagine you and your roommate both check the fridge and see there is no milk (Check). You both leave for the store at the same time without telling each other. You buy milk (Act), and your roommate buys milk (Act). Now you have two gallons of milk. You raced to act on the same piece of information, resulting in an incorrect state. A lock would be leaving a sticky note on the fridge saying "I am going to buy milk."

### Key Points
- Arises from concurrent access to shared, mutable state.
