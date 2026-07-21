---
id: general-040
topic: General
difficulty: Middle
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["Static", "Final"]
---

# Static vs Final Modifiers
Review the following code. Will it compile? If not, explain why and how to fix it based on the definitions of `static` and `final`.

```java
public class ConfigManager {
    public static final int MAX_USERS;
    public final String dbUrl;

    public ConfigManager() {
        MAX_USERS = 100;
        dbUrl = "jdbc:mysql://localhost:3306/db";
    }
}
```

---ANSWER---

The code **will not compile**.

The error occurs at `MAX_USERS = 100;`. 
Because `MAX_USERS` is declared as `static final`, it belongs to the class itself, not to any instance. Therefore, it must be initialized either at the point of declaration or within a `static` initialization block. It cannot be initialized in the constructor, because the constructor is called every time an object is instantiated, which would attempt to reassign a `final` static variable.

**To fix it:**
Initialize `MAX_USERS` at declaration:
```java
public class ConfigManager {
    public static final int MAX_USERS = 100;
    public final String dbUrl;

    public ConfigManager() {
        dbUrl = "jdbc:mysql://localhost:3306/db";
    }
}
```

### Life Analogy
`static` is a rule for the entire company (Class), while `final` means the rule can never be changed. `MAX_USERS` is a company-wide permanent rule. You must set this rule when the company is founded (static block/declaration). The constructor is like hiring a new employee; you can't rewrite the company's permanent rules every time a new employee is hired.

### Key Points
- `static` members belong to the class, not the instance.
- `final` members cannot be reassigned once initialized.
- `static final` variables must be initialized during class loading (at declaration or in a static block).
- Instance `final` variables can be initialized in the constructor.
