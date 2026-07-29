---
id: algo-005
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Fast & Slow Pointers
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 142
frequency: 94%
time: 15 min
tags: [Linked List, Two Pointers, LeetCode 142]
---

# LeetCode 142: Linked List Cycle II

Given the `head` of a linked list, return the node where the cycle begins. If there is no cycle, return `null`.

Do not modify the linked list.

### Constraints:
- The number of nodes in the list is in the range `[0, 10^4]`.
- `-10^5 <= Node.val <= 10^5`
- Solve using **O(1) extra memory**.

---ANSWER---

### 💡 Intuition & Pattern Recognition

A simple `HashSet<ListNode>` detects the cycle entry node in O(N) space by storing visited nodes.
To solve it with **O(1) extra space**, we use **Floyd's Tortoise and Hare Algorithm (Fast & Slow Pointers)**.

**Mathematical Proof of Cycle Entry:**
1. Let distance from `head` to cycle entry be $A$.
2. Let distance from cycle entry to intersection point be $B$.
3. Let remaining cycle length back to entry be $C$.
- When `slow` and `fast` meet:
  - Distance travelled by `slow` = $A + B$
  - Distance travelled by `fast` = $A + B + C + B = A + 2B + C$
- Since `fast` moves at twice the speed of `slow`:
  $$2(A + B) = A + 2B + C ⇒ 2A + 2B = A + 2B + C ⇒ A = C$$

**Conclusion:** The distance from `head` to cycle entry ($A$) is **exactly equal** to the distance from the intersection point to cycle entry ($C$)!


### ⚙️ Step-by-Step Visual Walkthrough

1. **Phase 1: Detect Cycle / Find Intersection**:
   - Initialize `slow = head` and `fast = head`.
   - Loop `while (fast != null && fast.next != null)`.
   - `slow = slow.next` (1 step).
   - `fast = fast.next.next` (2 steps).
   - If `slow == fast`, a cycle exists and they have met at the intersection point!

2. **Phase 2: Find Cycle Start Node**:
   - Reset `slow = head` (keeping `fast` at the intersection point).
   - Advance both `slow` and `fast` **one step at a time**.
   - The node where they meet again is the **exact cycle entry node**!


### ⚠️ Edge Cases & Pitfalls

- **Empty List or Single Node**: `head == null` or `head.next == null` cannot contain a cycle. Return `null`.
- **No Cycle in List**: `fast` will reach `null`. Handle `fast != null && fast.next != null` check to prevent `NullPointerException`.
- **Modifying Node Values**: Do not modify node values or pointers; interviewers require O(1) read-only traversal.


### 💻 Production Java Solution

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; next = null; }
}

public class LinkedListCycleII {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }

        ListNode slow = head;
        ListNode fast = head;
        boolean hasCycle = false;

        // Phase 1: Detect intersection using Fast & Slow pointers
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }

        if (!hasCycle) {
            return null;
        }

        // Phase 2: Reset slow to head, move both 1 step at a time to find entry
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }

        return slow; // Cycle entry node
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N)
  Phase 1 takes O(N) steps to intersect. Phase 2 takes $O(A) \le O(N)$ steps. Total time is linear O(N).
- **Space Complexity**: O(1)
  Only two pointer references are maintained.
