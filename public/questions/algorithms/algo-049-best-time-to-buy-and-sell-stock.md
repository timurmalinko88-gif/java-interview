---
id: algo-049
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Two Pointers
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 121
frequency: 99%
time: 5 min
tags: [Arrays, Two Pointers, Dynamic Programming, LeetCode 121]
---

# LeetCode 121: Best Time to Buy and Sell Stock

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return maximum profit.

### Constraints:
- `1 <= prices.length <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Track minimum buy price `minPrice` so far. For each price `p`, potential profit = `p - minPrice`.
Update max profit found.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }

        return maxProfit;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
