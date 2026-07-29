---
id: algo-031
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Heap / Priority Queue
time_complexity: O(N log K)
space_complexity: O(K)
leetcode_id: 23
frequency: 96%
time: 15 min
tags: [Linked List, Heap, PriorityQueue, LeetCode 23]
---

# LeetCode 23: Merge k Sorted Lists

You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

### Constraints:
- `k == lists.length`, `0 <= k <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Min-Heap (PriorityQueue):
1. Insert the head of each non-null linked list into Min-Heap ordered by node value.
2. Extract the minimum node from the heap, attach to merged list.
3. If extracted node has a `.next`, push `.next` into the heap.

### ⚙️ Step-by-Step Visual Walkthrough

`l1: 1->4->5`, `l2: 1->3->4`, `l3: 2->6`:
1. Min-Heap initialized with `[1(l1), 1(l2), 2(l3)]`.
2. Extract 1(l1), attach to tail. Push 4(l1). Heap: `[1(l2), 2(l3), 4(l1)]`.
3. Extract 1(l2), attach to tail. Push 3(l2).
4. Continue until heap empty. Result: `1->1->2->3->4->4->5->6`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

        for (ListNode node : lists) {
            if (node != null) pq.add(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!pq.isEmpty()) {
            ListNode minNode = pq.poll();
            tail.next = minNode;
            tail = tail.next;

            if (minNode.next != null) {
                pq.add(minNode.next);
            }
        }

        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log K) — N total nodes across K lists.
- **Space Complexity:** O(K) — Heap size at most K.
