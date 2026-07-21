---
id: spring-047
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Testing", "Mockito"]
---

# @Mock vs @MockBean
What is the difference between Mockito's `@Mock` and Spring Boot's `@MockBean`? When should you use which?

---ANSWER---

Both annotations are used to create mock objects for testing, but they operate in entirely different environments.

**1. `@Mock` (from Mockito):**
-   **Environment:** Used in standard **Unit Tests** (tests that do NOT load the Spring context).
-   **Action:** It creates a simple Mockito proxy object. You must manually inject this mock into the class you are testing, usually using `@InjectMocks` or via constructor injection in a `@BeforeEach` setup method.
-   **Speed:** Extremely fast, because Spring is not involved.

**2. `@MockBean` (from Spring Boot Test):**
-   **Environment:** Used in **Integration Tests** (tests annotated with `@SpringBootTest` or test slices like `@WebMvcTest` that *do* load the Spring context).
-   **Action:** It creates a Mockito mock *and* registers it directly into the Spring ApplicationContext, completely replacing any existing real bean of the same type. When other beans in the context request this dependency, Spring injects the mock instead of the real bean.
-   **Speed:** Slower, because it requires the Spring context to load and may cause the context to reload if the mock definitions change between tests.

### Life Analogy
-   **`@Mock` (Unit Test):** You are practicing a play in your living room. You use a broomstick (`@Mock`) to pretend it's a sword. You hand it to your friend manually to practice the scene.
-   **`@MockBean` (Integration Test):** You are at the grand theater doing a full dress rehearsal with the entire cast and crew (Spring Context). The prop master replaces the real, sharp metal sword in the prop armory with a safe rubber one (`@MockBean`). Whenever any actor asks the armory for the sword, they are automatically handed the rubber one.

### Key Points
- `@Mock` is pure Mockito; used for fast unit tests without Spring.
- `@MockBean` is Spring Boot; replaces a real bean in the Spring ApplicationContext with a mock.
- Use `@Mock` whenever possible for speed. Use `@MockBean` when you must test integration but need to stub out a specific external layer (like a database or 3rd party API).
