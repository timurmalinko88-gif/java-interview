---
id: algo-011
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Top 'K' Elements
time_complexity: O(N log K)
space_complexity: O(N)
leetcode_id: 347
frequency: 97%
time: 15 min
tags: [Heap, PriorityQueue, Hash Table, LeetCode 347]
---

# LeetCode 347: Top K Frequent Elements

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.

### Constraints:
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `k` is in the range `[1, the number of unique elements in the array]`.
- It is guaranteed that the answer is unique.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Step 1: Count element frequencies using a `HashMap<Integer, Integer>`.

Step 2: Find top `k` frequencies.
- **Option A (Sorting Map Entries)**: Takes O(U \log U) time where $U$ is unique element count.
- **Option B (Min-Heap / PriorityQueue of size K)**: Maintain a Min-Heap ordered by frequency. When heap size exceeds `k`, pop the smallest frequency element (`minHeap.poll()`). At the end, the heap contains the $K$ most frequent elements! Time complexity: O(N \log K).
- **Option C (Bucket Sort)**: Create array of lists indexed by frequency $1...N$. Time complexity: O(N).

The **Min-Heap (PriorityQueue)** approach is the standard industrial pattern asked in Java interviews because it tests `PriorityQueue` comparator syntax.


### ⚙️ Step-by-Step Visual Walkthrough

Consider `nums = [1, 1, 1, 2, 2, 3]`, `k = 2`.

1. **Frequency Map**:
   `{1: 3, 2: 2, 3: 1}`

2. **Min-Heap Processing** (ordered by frequency ascending):
   - Add `1` (freq 3) → Heap: `[1]`
   - Add `2` (freq 2) → Heap: `[2 (freq 2), 1 (freq 3)]`
   - Add `3` (freq 1) → Heap size becomes `3 > k (2)`.
   - Poll top of min-heap → `3` (smallest freq 1) removed!
   - Heap contains `[2, 1]`.

3. Extract result array → `[2, 1]`.


### ⚠️ Edge Cases & Pitfalls

- **Min-Heap vs Max-Heap**: Use a **Min-Heap** bounded to size `k` to achieve O(N \log K) instead of a Max-Heap holding all elements (O(N \log N)).
- **Comparator Definition**: `PriorityQueue<Integer> minHeap = new PriorityQueue<>((a, b) -> countMap.get(a) - countMap.get(b));`


### 💻 Production Java Solution

```java
import java.util.*;

public class TopKFrequentElements {
    public int[] topKFrequent(int[] nums, int k) {
        // Step 1: Count frequency of each element
        Map<Integer, Integer> countMap = new HashMap<>();
        for (int num : nums) {
            countMap.put(num, countMap.getOrDefault(num, 0) + 1);
        }

        // Step 2: Min-Heap of size K, comparing elements by frequency
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(
            (a, b) -> countMap.get(a) - countMap.get(b)
        );

        for (int num : countMap.keySet()) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Evict lowest frequency element
            }
        }

        // Step 3: Build output array
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll();
        }

        return result;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N \log K)
  Building frequency map takes O(N). Inserting into Min-Heap bounded to size $K$ takes O(\log K) for each of the $U \le N$ unique elements. Total O(N \log K).
- **Space Complexity**: O(N)
  Map stores up to $N$ unique elements.
