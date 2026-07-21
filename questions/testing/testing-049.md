---
id: testing-049
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["OAuth2"]
---

# OAuth2 Refresh Tokens

What is a Refresh Token and why is it used?

---ANSWER---

Access tokens are short-lived for security. A Refresh Token is a long-lived token used to obtain a new Access Token without requiring the user to log in again. If an access token is stolen, the window of vulnerability is small.

### Life Analogy
Access token is a daily ski lift ticket. Refresh token is the season pass you keep in your wallet to get a new daily ticket.

### Key Points
- Obtains new access tokens.
- Improves security via short-lived access tokens.
