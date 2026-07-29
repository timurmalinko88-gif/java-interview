---
id: algo-030
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Linked List
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 19
frequency: 95%
time: 10 min
tags: [Linked List, Two Pointers, LeetCode 19]
---

# LeetCode 19: Remove Nth Node From End of List

Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.

### Constraints:
- `1 <= n <= size of list`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Two Pointers with Fixed Gap:
1. Advance `fast` pointer `n + 1` steps ahead.
2. Advance both `slow` and `fast` pointers together until `fast` reaches `null`.
3. `slow` will now point right before the target node to delete! `slow.next = slow.next.next`.

### ⚙️ Step-by-Step Visual Walkthrough

For `dummy -> 1 -> 2 -> 3 -> 4 -> 5`, `n = 2`:
1. Move `fast` 3 steps forward (points at `3`).
2. Move both until `fast` is `null`: `slow` points at `3`.
3. `3.next = 5`.
Result: `1 -> 2 -> 3 -> 5`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode slow = dummy;
        ListNode fast = dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass.
- **Space Complexity:** O(1)
