---
id: multithreading-046
topic: Multithreading
difficulty: Senior
format: Open Answer
time: 8
frequency: 50%
source: Custom
prerequisites: ["Concurrency", "Context Switching"]
---

# Context Switching Overhead
What is a context switch, and why is high context switching detrimental to application performance?

---ANSWER---

A **context switch** is the process by which an operating system's CPU scheduler stops executing one thread, saves its state (context), loads the state of another thread, and begins executing the new thread. 
The "context" includes the CPU registers, program counter, and stack pointer.

**Why it is detrimental:**
Context switching is purely overhead. While the CPU is saving and loading states, it is not executing any actual application code. 
1. **CPU Cycles**: The physical act of swapping out registers and updating kernel data structures takes thousands of CPU cycles.
2. **Cache Pollution**: When a new thread starts running, the CPU caches (L1/L2/L3) are likely filled with data from the previous thread. The new thread will suffer many cache misses, forcing the CPU to fetch data from the much slower main memory, devastating performance.

This is why spawning 1,000 threads on a 4-core machine to do CPU-bound work is actually slower than spawning 4 threads. The OS spends more time switching between the 1,000 threads than doing the work.

- It consumes CPU cycles for kernel administrative work.
- It causes cache misses ("cache pollution"), slowing down execution.
- Too many active threads cause "thrashing," destroying throughput.

### Life Analogy
Imagine a chef trying to cook 10 different recipes simultaneously by working on Recipe 1 for 30 seconds, then moving to Recipe 2. A context switch is the time it takes the chef to put away the ingredients for Recipe 1, wash their hands, pull out the recipe book for Recipe 2, find the page, and gather the new ingredients. If the chef switches too fast, they spend all their time washing hands and reading, and no actual cooking gets done.

### Key Points
- Context switching is the OS swapping active threads on a CPU core.
