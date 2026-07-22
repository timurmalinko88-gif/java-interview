---
id: spring-007
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["DI"]
tags: ['spring-core']
---

# How does @Autowired work, and how do you resolve ambiguity?
Explain how `@Autowired` works. What happens if multiple beans of the same type exist in the context, and how do you resolve this ambiguity?

---ANSWER---

`@Autowired` is an annotation used to instruct Spring to automatically inject a dependency. Spring uses **Type-based injection** (byType) by default when resolving `@Autowired` dependencies.

If Spring finds exactly one bean of the required type in the application context, it injects it. 

**Ambiguity:**
If Spring finds *multiple* beans of the required type, it faces ambiguity and throws a `NoUniqueBeanDefinitionException` during application startup, because it doesn't know which one to inject.

**How to resolve ambiguity:**

1.  **`@Qualifier` (Recommended):** Use `@Qualifier("beanName")` alongside `@Autowired` to specify the exact name of the bean you want to inject. This forces Spring to switch from `byType` to `byName` resolution.
2.  **`@Primary`:** Annotate one of the bean implementations with `@Primary`. This tells Spring that this specific bean should be the default choice when multiple beans of that type are available.
3.  **Variable Naming (Fallback):** If no `@Qualifier` is used, Spring falls back to resolving by name, matching the bean name with the variable name. (e.g., if beans are `creditCardPayment` and `paypalPayment`, naming the variable `PaymentService creditCardPayment` will inject the former).

### Life Analogy
You ask an assistant for "a pen" (`@Autowired`).
If there is only a blue pen on the desk, they give it to you.
If there are a blue pen and a red pen, they get confused (Ambiguity).
To fix it, you either say "Give me the blue pen" (`@Qualifier`), or you put a "Default" sticker on the red pen beforehand (`@Primary`).

### Key Points
- `@Autowired` resolves dependencies by Type by default.
- Ambiguity occurs when multiple beans of the same type exist.
- Use `@Qualifier` to specify a bean by name.
- Use `@Primary` to define a default bean choice.
