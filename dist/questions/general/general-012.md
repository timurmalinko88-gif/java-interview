---
id: general-012
topic: General
difficulty: Junior
format: Open Answer
time: 6
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Memory"]
tags: []
---

# Pass by Value vs Pass by Reference

Is Java "pass-by-value" or "pass-by-reference"? Explain your answer with an example.

---ANSWER---

Java is strictly **pass-by-value**. It is never pass-by-reference.

However, the confusion arises because of how Java handles object variables. In Java, an object variable does not hold the object itself; it holds a *reference* (a memory address) pointing to the object on the heap. 

When you pass an object to a method, Java passes a **copy of that reference by value**. 

This means:
1. You **can** modify the internal state of the object the reference points to (e.g., changing a property of a `Person` object).
2. You **cannot** change the original reference to point to a completely new object.

**Example:**
```java
public void modify(Dog dog) {
    // 1. Modifying the state works, because we copied the reference pointing to the same Dog
    dog.setName("Max"); 

    // 2. Reassigning the reference fails to affect the caller!
    // This only changes the local copy of the reference.
    dog = new Dog("Fido"); 
}

// Caller:
Dog myDog = new Dog("Buddy");
modify(myDog);
System.out.println(myDog.getName()); // Output is "Max", NOT "Fido"
```

If Java were truly pass-by-reference, the assignment `dog = new Dog("Fido")` in the method would have overwritten `myDog` in the calling code.

### Life Analogy
Imagine you have the URL (reference) to a shared Google Doc. You write that URL on a piece of paper (pass by value) and hand it to a friend. 
Your friend can use the URL to edit the document, and you will see the changes (modifying object state). 
However, if your friend scratches out the URL on their piece of paper and writes a new URL to a completely different document (reassigning reference), it does not magically change what is written on *your* original piece of paper.

### Key Points
- Java is strictly pass-by-value.
- For primitives, the actual value is copied.
- For objects, a copy of the memory reference is passed.
- You can mutate object state, but you cannot reassign the caller's reference.
