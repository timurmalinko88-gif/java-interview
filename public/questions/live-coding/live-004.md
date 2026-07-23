---
id: live-004
path: questions/live-coding/live-004.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Hibernate N+1 & LazyInitializationException
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Hibernate N+1 & LazyInitializationException
We have a Spring Data JPA application that retrieves a list of `Author` entities and then prints the titles of their `Books`. In production, this code sometimes throws a `LazyInitializationException`. Even when it works (inside a transaction), it generates an absurd number of SQL queries, slowing down the database.

Please explain why this happens and refactor the code to fix both the exception and the performance issue.

---ANSWER---

The issues are caused by Hibernate's lazy loading strategy and the infamous N+1 query problem.
By default, `@OneToMany` relationships are fetched lazily. When the `Author` is loaded, its `books` collection is replaced by an uninitialized proxy. 
1. **LazyInitializationException:** If you try to access the `books` collection outside the scope of an active Hibernate Session (e.g., in the presentation layer after the transaction has closed), Hibernate cannot initialize the proxy, resulting in this exception.
2. **N+1 Problem:** If you iterate over `N` authors and call `author.getBooks()` within a transaction, Hibernate will execute 1 query to fetch the authors, and then `N` separate queries to fetch the books for each author.

To fix both issues efficiently, we should instruct Hibernate to fetch the associations eagerly in a single query when we know we will need them. This is typically done using a `JOIN FETCH` in a custom JPQL query or by using JPA EntityGraphs.

### Examples
```java
// BUGGY CODE:
@Entity
public class Author {
    @OneToMany(mappedBy = "author")
    private List<Book> books; // Lazy by default
}

// In Service:
List<Author> authors = authorRepository.findAll();
// Generates 1 query for authors, then N queries for books. 
// Will throw LazyInitializationException if no transaction is active.
for (Author a : authors) {
    System.out.println(a.getBooks().size()); 
}

// REFACTORED CODE:
// In AuthorRepository:
@Query("SELECT a FROM Author a JOIN FETCH a.books")
List<Author> findAllWithBooks();

// In Service:
List<Author> authors = authorRepository.findAllWithBooks();
// Generates exactly 1 SQL query: SELECT ... FROM author LEFT OUTER JOIN book ...
for (Author a : authors) {
    System.out.println(a.getBooks().size()); // Safe, already loaded
}
```

### Life Analogy
Imagine you are at a restaurant ordering for a group of 10 people. 
N+1 Problem: You ask the waiter for a list of everyone at the table (1 request). Then you call the waiter over 10 separate times to ask what each person wants to drink (N requests). This exhausts the waiter.
JOIN FETCH: You give the waiter a single piece of paper containing everyone's name and their drink orders all at once (1 request). Much faster!

### Key Points
- Lazy loading is good for memory, but accessing lazy collections outside a transaction throws `LazyInitializationException`.
- Iterating over lazy collections inside a transaction causes the N+1 query performance bottleneck.
- Use `JOIN FETCH` or `@EntityGraph` to eagerly load exactly the data you need in a single SQL query.
