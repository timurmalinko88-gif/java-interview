---
id: spring-023
topic: Spring
difficulty: Senior
format: Open Answer
time: 7
frequency: 50%
source: Custom
prerequisites: ["Spring MVC", "REST"]
---

# How does Content Negotiation work in Spring?
Explain the concept of Content Negotiation in Spring MVC. How does Spring decide whether to return JSON, XML, or another format?

---ANSWER---

**Content Negotiation** is a mechanism that allows a client and a server to agree on the format of the data being exchanged. A single REST endpoint can return data in multiple formats (JSON, XML, PDF) depending on what the client requests.

**How Spring decides the format (in order of priority):**

1.  **Path Extension (Deprecated):** Previously, a client could request `/api/users.json` or `/api/users.xml`. Spring Boot disables this by default now due to security and URL purity concerns.
2.  **URL Parameter:** The client can pass a format parameter, e.g., `/api/users?format=xml`. (Requires explicit configuration in Spring).
3.  **HTTP `Accept` Header (Standard & Recommended):** The client sends an `Accept` header in the HTTP request specifying the desired MIME type.
    -   `Accept: application/json` -> Server returns JSON.
    -   `Accept: application/xml` -> Server returns XML.

**How Spring processes it:**
When a controller method returns an object, the `DispatcherServlet` checks the Content Negotiation strategy (usually looking at the `Accept` header). It then iterates through all registered `HttpMessageConverter`s. It finds the first converter that supports both the returned Java Object type and the requested MIME type. 
If Jackson is on the classpath, it handles JSON. If Jackson-XML is added, it can handle XML.

### Life Analogy
You go to a bilingual restaurant. The menu (API endpoint) is the same.
When you sit down, you say "Je voudrais le menu en français" (Sending `Accept: application/french` header). 
The waiter (DispatcherServlet) checks if they have a French translator (HttpMessageConverter). Since they do, they translate the standard dish (Java Object) into French (XML) and hand it to you.

### Key Points
- Content Negotiation allows one endpoint to serve multiple formats (JSON/XML).
- Primarily driven by the HTTP `Accept` Header.
- Handled internally by iterating through `HttpMessageConverter`s.
- Requires the appropriate serialization library (e.g., Jackson) on the classpath.
