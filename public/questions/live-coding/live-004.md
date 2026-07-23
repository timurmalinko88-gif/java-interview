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

### Problem

You have a one-to-many relationship between `Author` and `Book`. When fetching a list of authors and printing their book titles, you notice terrible performance and occasionally a `LazyInitializationException`.

**Buggy Code:**

```java
@Entity
public class Author {
    @Id private Long id;
    private String name;
    
    @OneToMany(mappedBy = "author")
    private List<Book> books;
    // getters/setters
}

@Entity
public class Book {
    @Id private Long id;
    private String title;
    
    @ManyToOne
    private Author author;
    // getters/setters
}

@Service
public class AuthorService {
    @Autowired private AuthorRepository repository;

    public void printAuthorBooks() {
        List<Author> authors = repository.findAll(); // Select all authors (1 query)
        for (Author author : authors) {
            // N additional queries executed here, or LazyInitializationException if no transaction!
            System.out.println("Author: " + author.getName());
            for (Book book : author.getBooks()) {
                System.out.println(" - " + book.getTitle());
            }
        }
    }
}
```

### Challenge
Fix the N+1 select problem and avoid `LazyInitializationException`.

---

### Solution

**Explanation:**
By default, `@OneToMany` collections are fetched lazily. Calling `repository.findAll()` executes 1 query to load all Authors. When `author.getBooks()` is accessed in the loop, Hibernate issues an additional query for each author to fetch their books, resulting in N+1 queries. Furthermore, if `printAuthorBooks` is not annotated with `@Transactional`, the Hibernate Session is closed after `findAll()`, causing a `LazyInitializationException` when accessing the lazy collection.

**Refactored Code:**
To fix this efficiently, we use a `JOIN FETCH` query in the repository.

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    
    // Use JOIN FETCH to load authors and books in a single query
    @Query("SELECT a FROM Author a JOIN FETCH a.books")
    List<Author> findAllWithBooks();
}

@Service
public class AuthorService {
    private final AuthorRepository repository;

    public AuthorService(AuthorRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true) // Good practice, though JOIN FETCH prevents LazyInitEx
    public void printAuthorBooks() {
        List<Author> authors = repository.findAllWithBooks(); 
        for (Author author : authors) {
            System.out.println("Author: " + author.getName());
            for (Book book : author.getBooks()) {
                System.out.println(" - " + book.getTitle());
            }
        }
    }
}
```
