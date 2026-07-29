---
id: algo-006
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Stack
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 20
frequency: 99%
time: 8 min
tags: [Stack, Strings, LeetCode 20]
---

# LeetCode 20: Valid Parentheses

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Constraints:
- `1 <= s.length <= 10^4`
- `s` consists of parentheses only `'()[]{}'`.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Parentheses checking obeys the **Last-In, First-Out (LIFO)** property: the most recently opened bracket must be closed first.

The canonical data structure for LIFO processing is a **Stack**:
- Iterate over each character in `s`.
- When encountering an opening bracket (`'('`, `'{'`, `'['`), push its expected closing bracket (`')'`, `'}'`, `']'`) onto the stack.
- When encountering a closing bracket, compare it with `stack.pop()`. If stack is empty or top does not match, return `false`.
- After string iteration, return `stack.isEmpty()`.

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = "({[]})"`.

1. `ch = '('` $\rightarrow$ push `')'` $\rightarrow$ Stack: `[')']`
2. `ch = '{'` $\rightarrow$ push `'}'` $\rightarrow$ Stack: `[')', '}']`
3. `ch = '['` $\rightarrow$ push `']'` $\rightarrow$ Stack: `[')', '}', ']']`
4. `ch = ']'` $\rightarrow$ `stack.pop()` returns `']'` == `ch`. Stack: `[')', '}']`
5. `ch = '}'` $\rightarrow$ `stack.pop()` returns `'}'` == `ch`. Stack: `[')']`
6. `ch = ')'` $\rightarrow$ `stack.pop()` returns `')'` == `ch`. Stack: `[]`
7. Loop finished. `stack.isEmpty() == true` $\rightarrow$ Return `true`.

---

### ⚠️ Edge Cases & Pitfalls

- **Odd Length Strings**: Any string with odd length (e.g. `length % 2 != 0`) cannot be valid. Return `false` immediately as early exit.
- **Starting with Closing Bracket**: `s = "]"` $\rightarrow$ stack will be empty when popping. Handle `stack.isEmpty()` check.
- **Unclosed Open Brackets**: `s = "(("` $\rightarrow$ after loop stack is not empty. Always check `stack.isEmpty()`.

---

### 💻 Production Java Solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class ValidParentheses {
    public boolean isValid(String s) {
        if (s == null || s.length() % 2 != 0) {
            return false;
        }

        // Use ArrayDeque as a faster alternative to java.util.Stack
        Deque<Character> stack = new ArrayDeque<>();

        for (char ch : s.toCharArray()) {
            if (ch == '(') {
                stack.push(')');
            } else if (ch == '{') {
                stack.push('}');
            } else if (ch == '[') {
                stack.push(']');
            } else {
                if (stack.isEmpty() || stack.pop() != ch) {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(N)$
  Single pass through string of length $N$. `push` and `pop` on `ArrayDeque` take $O(1)$ time.
- **Space Complexity**: $O(N)$
  In the worst case (e.g. `"((((("`), stack stores $N$ elements.
