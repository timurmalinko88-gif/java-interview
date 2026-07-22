---
id: testing-038
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Mockito"]
tags: ['testing']
---

# Mockito Argument Matchers

How do you use Mockito Argument Matchers like `any()`?

---ANSWER---

Argument matchers allow you to stub or verify methods without specifying exact arguments. For example, `when(service.find(anyInt())).thenReturn(...)`. 
*Rule:* If you use a matcher for one argument, you must use matchers for all arguments in that method call.

### Life Analogy
It's like a bouncer letting anyone in who wears a blue shirt, regardless of their name.

### Key Points
- Flexible stubbing.
- Don't mix matchers with raw values.
