---
id: databases-054
topic: Databases
difficulty: Middle
format: Open Answer
time: 8
frequency: 85%
source: Custom
prerequisites: ["JPA", "Hibernate", "Concurrency", "Locking"]
tags: ['core-middle', 'databases', 'jpa', 'locking']
---

# Optimistic vs Pessimistic Locking in JPA and Hibernate

What is the difference between Optimistic and Pessimistic locking in JPA? When would you choose one over the other, and how do you handle `OptimisticLockException`?

---ANSWER---

Concurrency control in relational databases prevents lost updates when multiple transactions attempt to update the same record simultaneously.

### Optimistic Locking
Optimistic locking assumes collisions are **rare**. It does not lock rows at the database level during the read phase.

- **Mechanism:** A version column (integer or timestamp) annotated with `@Version` is added to the entity:
  ```java
  @Entity
  public class Account {
      @Id
      private Long id;
      private BigDecimal balance;

      @Version
      private Long version;
  }
  ```
- **SQL on Update:**
  ```sql
  UPDATE account SET balance = 150, version = version + 1 
  WHERE id = 1 AND version = 0;
  ```
- If another transaction already bumped `version` to 1, the update returns 0 affected rows, and Hibernate throws `OptimisticLockException`.
- **Handling:** Caught at service level with a retry loop or backoff (e.g. `@Retryable`).

### Pessimistic Locking
Pessimistic locking assumes collisions are **frequent**. It locks rows directly at the database engine level via SQL `SELECT ... FOR UPDATE`.

- **Mechanism in Spring Data JPA:**
  ```java
  public interface AccountRepository extends JpaRepository<Account, Long> {
      @Lock(LockModeType.PESSIMISTIC_WRITE)
      @Query("SELECT a FROM Account a WHERE a.id = :id")
      Optional<Account> findByIdForUpdate(@Param("id") Long id);
  }
  ```
- Other transactions trying to read or write this row block until the lock-holding transaction commits or rolls back.

### Decision Matrix

| Criterion | Optimistic Locking | Pessimistic Locking |
|---|---|---|
| **Collision Frequency** | Low to moderate | High (hot records) |
| **Lock Type** | Application-level check | Database row-level lock (`FOR UPDATE`) |
| **Throughput** | High (no blocking) | Lower (threads queue up) |
| **Deadlock Risk** | Zero DB deadlocks | Possible if locks acquired out of order |
| **Use Case** | User profile, Order metadata | Flash sale stock, Bank balance decrement |

### Key Takeaways
- Optimistic: use `@Version`, best for high-throughput reads with rare collision updates.
- Pessimistic: use `LockModeType.PESSIMISTIC_WRITE`, best for high-contention financial or inventory operations.\n