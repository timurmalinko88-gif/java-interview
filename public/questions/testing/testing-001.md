---
id: testing-001
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["JUnit"]
tags: [oop, spring-core, system-design, testing, stream-api, jvm, multithreading, exceptions]
---

# JUnit 5 vs JUnit 4

What are the main differences between JUnit 4 and JUnit 5? How has the architecture changed?

---ANSWER---

JUnit 5 represents a complete rewrite of the JUnit framework. Unlike JUnit 4, which was a single monolithic JAR file, JUnit 5 is composed of three main sub-projects:

1. **JUnit Platform:** The foundation for launching testing frameworks on the JVM.
2. **JUnit Jupiter:** The programming model and extension model for writing tests in JUnit 5.
3. **JUnit Vintage:** A test engine for running JUnit 3 and JUnit 4 based tests on the platform.

**Key Annotations Changes:**
- `@Before` -> `@BeforeEach`
- `@After` -> `@AfterEach`
- `@BeforeClass` -> `@BeforeAll`
- `@AfterClass` -> `@AfterAll`
- `@Ignore` -> `@Disabled`

JUnit 5 also introduces new features like `@DisplayName`, `@Nested` classes, parameterized tests natively, and better support for Java 8 features (like lambdas for assertions: `assertAll`, `assertThrows`).

### Life Analogy
Think of JUnit 4 as a Swiss Army knife — all tools in one block. JUnit 5 is like a modular toolbox where the foundation (Platform), the new modern tools (Jupiter), and a compatibility layer for old tools (Vintage) are separated but work together.

### Key Points
- Modular architecture (Platform, Jupiter, Vintage).
- Updated annotations (e.g., `@BeforeEach` instead of `@Before`).
- Native support for Java 8 features (lambdas).
- Better extension model (`@ExtendWith` replacing `@RunWith`).
