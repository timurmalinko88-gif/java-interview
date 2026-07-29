---
id: algo-029
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Linked List
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 143
frequency: 92%
time: 12 min
tags: [Linked List, Two Pointers, LeetCode 143]
---

# LeetCode 143: Reorder List

You are given the head of a singly linked list `L0 -> L1 -> ... -> Ln-1 -> Ln`.

Reorder the list to be: `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...` in-place.

### Constraints:
- `1 <= number of nodes <= 5 * 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Three-Step Strategy:
1. Find middle of linked list using Fast & Slow pointers.
2. Reverse the second half of the linked list.
3. Interleave the first half and reversed second half nodes one by one.

### ⚙️ Step-by-Step Visual Walkthrough

For `1 -> 2 -> 3 -> 4 -> 5`:
1. Middle = `3`. Second half = `4 -> 5`.
2. Reverse second half: `5 -> 4`.
3. Interleave `1 -> 2 -> 3` and `5 -> 4`:
   `1 -> 5 -> 2 -> 4 -> 3`.

### 💻 Production Java Implementation

```java
public class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;

        // Step 1: Find middle
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: Reverse second half
        ListNode prev = null, curr = slow.next;
        slow.next = null; // Split lists
        while (curr != null) {
            ListNode tmp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = tmp;
        }

        // Step 3: Interleave
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;

            first.next = second;
            second.next = tmp1;

            first = tmp1;
            second = tmp2;
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
