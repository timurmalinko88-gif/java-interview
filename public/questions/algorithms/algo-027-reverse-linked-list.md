---
id: algo-027
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Linked List
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 206
frequency: 99%
time: 5 min
tags: [Linked List, Two Pointers, LeetCode 206]
---

# LeetCode 206: Reverse Linked List

Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.

### Constraints:
- The number of nodes in the list is in the range `[0, 5000]`.
- `-5000 <= Node.val <= 5000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Maintain three pointers: `prev` (initialized to null), `curr` (initialized to head), and `nextTemp`.
Iteratively point `curr.next` to `prev`, then advance `prev` and `curr`.

### ⚙️ Step-by-Step Visual Walkthrough

`1 -> 2 -> 3 -> null`:
1. Save `next = 2`. Set `1.next = null`. `prev = 1`, `curr = 2`.
2. Save `next = 3`. Set `2.next = 1`. `prev = 2`, `curr = 3`.
3. Save `next = null`. Set `3.next = 2`. `prev = 3`, `curr = null`.
Result: `prev` points to head of `3 -> 2 -> 1 -> null`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;

        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }

        return prev;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
