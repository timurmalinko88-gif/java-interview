---
id: general-005
topic: General
difficulty: Middle
format: Open Answer
time: 8
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Static Keyword", "Memory Management"]
tags: ['exceptions']
---

# Memory Management of Static Variables

Explain how and where static variables are stored in memory in modern Java (Java 8+). Does a static variable get garbage collected?

---ANSWER---

In Java, the `static` keyword means that a variable belongs to the class itself rather than to any specific instance of the class.

**Where are they stored?**
Prior to Java 8, static variables were stored in the **PermGen** (Permanent Generation) space, which was a specific part of the heap space. 
Starting from Java 8, PermGen was replaced by **Metaspace**. The class metadata (methods, bytecodes, etc.) is stored in Metaspace (which resides in native memory). However, the actual **static variables (references and primitive values) are stored in the regular Heap**. If the static variable is a reference to an object, the object itself also resides in the heap.

**Garbage Collection:**
Static variables are tied to the lifecycle of the `Class` object that defines them. They are not garbage collected as long as the class itself is loaded. 
A class can be unloaded (and thus its static variables garbage collected) only if the `ClassLoader` that loaded it becomes unreachable and is garbage collected. In typical applications using the system class loader, static variables effectively live for the entire duration of the application. This makes static variables a common source of memory leaks if not managed carefully (e.g., static maps growing indefinitely).

### Life Analogy
Think of instance variables as personal notebooks assigned to individual students in a classroom; they are thrown away when the student leaves (Garbage Collection). A static variable is the classroom whiteboard. It exists as long as the classroom exists, and whatever is written on it is shared by all students. It only gets wiped permanently if the entire school is demolished (ClassLoader unloaded).

### Key Points
- Since Java 8, static variables are stored on the Heap, not in Metaspace.
- Static variables belong to the Class, not the instance.
- They are garbage collected only if the ClassLoader that loaded the class is garbage collected.
- They are a frequent cause of memory leaks.
