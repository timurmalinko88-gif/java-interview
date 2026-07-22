---
id: spring-017
topic: Spring
difficulty: Middle
format: Open Answer
time: 8
frequency: 85%
source: Custom
prerequisites: ["DispatcherServlet"]
tags: [oop, spring-core, stream-api, spring-mvc, multithreading, collections]
---

# Explain the Spring MVC Request Processing flow.
Walk through the step-by-step flow of an HTTP request in a traditional Spring MVC application (returning a View).

---ANSWER---

The flow of a request in Spring MVC follows these steps:

1.  **Incoming Request:** The client sends an HTTP request, which is intercepted by the `DispatcherServlet` (Front Controller).
2.  **Handler Mapping:** The `DispatcherServlet` consults the `HandlerMapping`. The `HandlerMapping` inspects the request URL and determines which specific `Controller` method (Handler) should process it.
3.  **Controller Execution:** The `DispatcherServlet` routes the request to the chosen `Controller`. The controller executes the business logic (often calling Service layer beans).
4.  **ModelAndView:** After processing, the `Controller` returns a `ModelAndView` object to the `DispatcherServlet`. This object contains the model (data) and the logical name of the view to be rendered.
5.  **View Resolution:** The `DispatcherServlet` consults the `ViewResolver`. It passes the logical view name, and the `ViewResolver` translates it into a physical view component (e.g., resolving "home" to `/WEB-INF/jsp/home.jsp`).
6.  **Rendering:** The `DispatcherServlet` passes the Model data to the resolved View component.
7.  **Response:** The View renders the HTML (or other formats), and the `DispatcherServlet` returns the final HTTP Response to the client.

*(Note: For `@RestController`, steps 4-6 are bypassed. The controller directly returns data, which is converted to JSON/XML via `HttpMessageConverters` and written straight to the response body).*

### Life Analogy
1.  **Request:** You (Client) hand an order to the Waiter (DispatcherServlet).
2.  **Mapping:** The Waiter looks at the menu system (HandlerMapping) to see who cooks this dish.
3.  **Controller:** The Waiter gives the ticket to the Chef (Controller). The Chef cooks.
4.  **ModelAndView:** The Chef hands the cooked food (Model) and a plating instruction (View Name) back to the Waiter.
5.  **ViewResolver:** The Waiter asks the Expediter (ViewResolver) which specific plate to use.
6.  **Rendering:** The food is plated nicely.
7.  **Response:** The Waiter serves the dish to you.

### Key Points
- DispatcherServlet -> HandlerMapping -> Controller -> DispatcherServlet -> ViewResolver -> View -> Response.
- `DispatcherServlet` orchestrates the entire process.
- Controllers process logic; Views render output.
