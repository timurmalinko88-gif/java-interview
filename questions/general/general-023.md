---
id: general-023
topic: General
difficulty: Middle
format: Code Review
time: 12
frequency: 85%
source: Custom
prerequisites: ["Core Java", "Basics"]
---

# Pass by value semantics: Modifying vs Reassigning
Review the following code. What will be printed to the console, and why? Explain Java's parameter passing mechanism.

```java
public class ReferenceTest {
    static class Data { int value; }
    
    public static void modify(Data d) {
        d.value = 100;
        d = new Data();
        d.value = 200;
    }
    
    public static void main(String[] args) {
        Data myData = new Data();
        myData.value = 50;
        modify(myData);
        System.out.println(myData.value);
    }
}
```

---ANSWER---

The code will print **`100`**.

**Explanation:**
Java is strictly **pass-by-value**. However, when passing objects to methods, it passes the *value of the reference* (the memory address pointer), not the actual object itself.

Here is the step-by-step breakdown:
1. `Data myData = new Data();` creates an object in the heap. Let's say it's at memory address 0x01. `myData` holds the value 0x01.
2. `myData.value = 50;` modifies the object at 0x01.
3. `modify(myData);` is called. A **copy** of the reference (`myData`) is passed to the parameter `d`. Now, both `myData` and `d` hold the value 0x01. They point to the same object.
4. Inside the method, `d.value = 100;` goes to address 0x01 and changes the value. This affects the original object.
5. `d = new Data();` creates a brand new object at address 0x02. The local variable `d` is updated to hold 0x02. **Crucially, the original variable `myData` in main still holds 0x01.** Reassigning `d` only changes the local copy of the reference.
6. `d.value = 200;` modifies the new object at 0x02.
7. The method ends. The object at 0x02 is orphaned and ready for garbage collection.
8. Back in main, `myData` still points to 0x01, which was modified in step 4 to have a value of 100.

### Life Analogy
Imagine you have a remote control (reference `myData`) for a TV (the object). You hand a copy of the remote (reference `d`) to a repairman. 
1. The repairman uses their remote to change the channel on your TV (modifying `d.value`). 
2. Then, the repairman programs their remote to point to a completely different TV in the shop (`d = new Data()`). 
3. They change the channel on the shop's TV (`d.value = 200`). 
When they leave, your original remote still points to your original TV, which is now on the channel the repairman initially set it to (100).

### Key Points
- Java is strictly pass-by-value.
- For primitives, the actual value is copied.
- For objects, the reference (memory address) is copied.
- Modifying the state of the object via the copied reference affects the original object.
- Reassigning the copied reference to a new object does NOT affect the original reference.
