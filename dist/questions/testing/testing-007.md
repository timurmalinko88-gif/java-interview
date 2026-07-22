---
id: testing-007
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["OAuth2"]
tags: [spring-core, testing, memory]
---

# OAuth2 Authorization Code Flow

What is the Authorization Code Flow in OAuth2?

---ANSWER---

It is the most common OAuth2 flow for web applications. 
1. Client redirects user to Authorization Server.
2. User logs in and grants permission.
3. Server redirects back to Client with an Authorization Code.
4. Client securely exchanges the Code for an Access Token.

### Life Analogy
It's like going to a hotel. You show your ID to the desk (auth server), they give you a keycard (access token), and you use the keycard to enter your room (resource).

### Key Points
- Secure flow for web apps.
- Keeps tokens out of the browser.
