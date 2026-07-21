---
id: spring-030
topic: Spring
difficulty: Senior
format: Open Answer
time: 8
frequency: 85%
source: Custom
prerequisites: ["Spring Data JPA", "Hibernate"]
---

# Explain the N+1 Select Problem and its solutions.
What is the "N+1 select problem" in Spring Data JPA / Hibernate? How can you solve it?

---ANSWER---

The **N+1 select problem** is a severe performance issue where an ORM (like Hibernate) executes one query to retrieve a list of parent entities (1), and then executes an additional query for *every single parent entity* (N) to fetch its lazy-loaded child entities.

**Example Scenario:**
You have a `Post` entity that has a `@OneToMany` relationship with `Comment`.
If you do `postRepository.findAll()`, Hibernate executes:
1. `SELECT * FROM Post;` (Assume this returns 100 posts).
Then, as you loop through the posts and call `post.getComments()`, Hibernate executes:
2. `SELECT * FROM Comment WHERE post_id = 1;`
3. `SELECT * FROM Comment WHERE post_id = 2;`
... and so on, 100 times.
Total queries: 1 (for parents) + 100 (for children) = 101 queries. This crushes database performance.

**How to solve it in Spring Data JPA:**

1.  **`@EntityGraph` (Recommended):**
    Allows you to dynamically override the lazy-loading strategy for a specific query. You define an EntityGraph that specifies which associations should be fetched eagerly via a SQL `JOIN`.
    ```java
    @EntityGraph(attributePaths = {"comments"})
    List<Post> findAll(); // Fetches Posts and Comments in one JOIN query.
    ```
2.  **`JOIN FETCH` in `@Query`:**
    Write a custom JPQL query and explicitly use the `JOIN FETCH` keyword.
    ```java
    @Query("SELECT p FROM Post p JOIN FETCH p.comments")
    List<Post> findAllWithComments();
    ```
3.  **Hibernate `@BatchSize`:**
    Set `@BatchSize(size=10)` on the collection. Hibernate won't use a JOIN, but when you access the first comment collection, it will fetch the comments for the next 10 posts in a single `IN (...)` clause. Turns N+1 into (N/10)+1.

*(Note: Simply changing `@OneToMany(fetch = FetchType.EAGER)` is considered a bad practice, as it causes performance issues globally everywhere the entity is used).*

### Life Analogy
You are a manager who needs the weekly reports from 10 employees.
-   **N+1 Problem:** You go to the office (1 trip), walk to employee 1, ask for the report, walk back to your desk. Then walk to employee 2, ask for the report, walk back. You do this 10 times (N trips).
-   **EntityGraph/Join Fetch:** You send out a memo before you leave your desk: "Everyone bring your reports to the meeting room now." You go to the room (1 trip) and collect everything at once.

### Key Points
- N+1 occurs when fetching lazy associations in a loop.
- Results in excessive database queries.
- Do NOT fix by globally setting `FetchType.EAGER`.
- Fix using `@EntityGraph` or JPQL `JOIN FETCH`.
