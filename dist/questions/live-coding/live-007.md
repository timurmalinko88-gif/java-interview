---
id: live-007
path: questions/live-coding/live-007.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Refactoring nested if-else to Pattern Matching & Optional
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Refactoring nested if-else to Pattern Matching & Optional
We have a legacy method `processUserContact()` that parses an `Object` and extracts a contact string. The code is filled with `instanceof` checks, explicit casting, and deeply nested null checks, making it hard to read and prone to `NullPointerExceptions`.

Can you refactor this method using modern Java features like `Optional` and Pattern Matching for `instanceof` (or Switch Pattern Matching if using Java 21) to make it clean and robust?

---ANSWER---

Deeply nested null checks are historically known as the "Arrow Anti-Pattern" (due to the code shape). This is difficult to read and maintain. Java 8 introduced `Optional` to elegantly handle the presence or absence of values without explicit null checks using `map` and `flatMap`.

Furthermore, older Java required checking `instanceof` and then explicitly casting the variable on the very next line. Modern Java (Java 16+) introduced Pattern Matching for `instanceof`, allowing you to declare the casted variable directly in the `if` condition. Java 21 extends this to `switch` statements.

By combining pattern matching to safely extract the type and `Optional` to chain the nested object properties safely, we can reduce cyclomatic complexity drastically.

### Examples
```java
// BUGGY CODE:
public String processUserContact(Object input) {
    if (input != null) {
        if (input instanceof User) {
            User user = (User) input;
            if (user.getProfile() != null) {
                if (user.getProfile().getAddress() != null) {
                    return user.getProfile().getAddress().getCity();
                }
            }
        } else if (input instanceof String) {
            String str = (String) input;
            return "Contact: " + str;
        }
    }
    return "Unknown";
}

// REFACTORED CODE (Java 16+ Pattern Matching & Optional):
public String processUserContact(Object input) {
    if (input instanceof User user) {
        return Optional.of(user)
                .map(User::getProfile)
                .map(Profile::getAddress)
                .map(Address::getCity)
                .orElse("Unknown");
    } 
    
    if (input instanceof String str) {
        return "Contact: " + str;
    }
    
    return "Unknown";
}

// Java 21+ Switch Pattern Matching alternative:
/*
public String processUserContact(Object input) {
    return switch(input) {
        case User u -> Optional.ofNullable(u.getProfile())...orElse("Unknown");
        case String s -> "Contact: " + s;
        case null, default -> "Unknown";
    };
}
*/
```

### Life Analogy
Legacy `instanceof` is like a bouncer at a club checking your ID, then making you pull it out again to show the bartender. Pattern matching is like the bouncer checking your ID and stamping your hand—now the bartender instantly knows who you are without asking again. `Optional` is like a mail forwarding service: instead of checking if someone lives at an address before sending mail, you just send it to the forwarding service, and if they moved, it safely handles the fallback without crashing the post office.

### Key Points
- Use `instanceof Type varName` (Pattern Matching) to eliminate boilerplate casting.
- Use `Optional.map()` to safely chain method calls that might return null.
- Early returns and guard clauses flatten nested `if` statements, improving readability.
