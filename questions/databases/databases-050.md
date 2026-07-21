---
id: databases-050
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["JDBC", "Performance"]
tags: [spring-boot, system-design, spring-core, collections]
---

# What is Database Connection Pooling?
Explain the concept of Database Connection Pooling (e.g., HikariCP) and why it is critical for application performance.

---ANSWER---

Database Connection Pooling is a technique used to maintain a cache (a "pool") of open, ready-to-use database connections, rather than opening and closing a new connection for every single database request.

**The Problem it Solves:**
Opening a physical connection to a database over a network is an extremely expensive and slow operation. It involves network handshakes, authentication, and allocating resources on the database server. If a high-traffic web application opens a new connection for every single user request and closes it immediately after, the application will crash or slow to a crawl under the sheer weight of connection overhead.

**How it works:**
1.  When the application starts, the Connection Pool manager (like HikariCP) opens a set number of connections to the database and holds them open.
2.  When the application needs to query the database, it asks the pool for a connection.
3.  The pool hands over an already-open connection.
4.  The application executes its query.
5.  Instead of closing the connection, the application *returns* it to the pool.
6.  The pool keeps it open and makes it available for the next request.

### Life Analogy
Imagine a car rental agency at an airport.
- **Without a Pool:** A customer arrives. The agency has to build a brand new car from scratch on the assembly line, give it to the customer, and when the customer returns it, they crush the car into a cube. Unbelievably slow and wasteful.
- **With a Pool:** The agency has 50 cars sitting in a parking lot with the keys in the ignition. A customer arrives, takes a car instantly, drives it, and returns it to the lot. The next customer takes the exact same car. Extremely fast and efficient.

### Key Points
- A cache of pre-opened database connections.
- Eliminates the massive performance overhead of creating new connections for every request.
- Examples include HikariCP (Spring Boot default), c3p0, and Tomcat JDBC Pool.
