---
id: algo-028
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Linked List
time_complexity: O(N + M)
space_complexity: O(1)
leetcode_id: 21
frequency: 97%
time: 6 min
tags: [Linked List, Two Pointers, LeetCode 21]
---

# LeetCode 21: Merge Two Sorted Lists

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. Return *the head of the merged linked list*.

### Constraints:
- The number of nodes in both lists is in the range `[0, 50]`.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Use a dummy sentinel node `dummy` and a pointer `tail`.
Compare `list1.val` and `list2.val`, attach the smaller node to `tail.next`, and advance that list pointer.

### ⚙️ Step-by-Step Visual Walkthrough

`l1: 1 -> 2 -> 4`, `l2: 1 -> 3 -> 4`:
1. Compare 1 and 1 → attach l1(1). `l1` moves to 2.
2. Compare 2 and 1 → attach l2(1). `l2` moves to 3.
3. Compare 2 and 3 → attach l1(2). `l1` moves to 4.
4. Continue until merged. Result: `1 -> 1 -> 2 -> 3 -> 4 -> 4`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N + M)
- **Space Complexity:** O(1)
