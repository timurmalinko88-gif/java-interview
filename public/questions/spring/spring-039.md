---
id: spring-039
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 85%
source: Custom
prerequisites: ["Spring Security", "Servlet Filters"]
tags: ['spring-core', 'spring-boot']
---

# What is the SecurityFilterChain?
Explain the concept of the `SecurityFilterChain` in Spring Security. How does it relate to standard Servlet Filters?

---ANSWER---

Spring Security's web infrastructure is based entirely on standard Java Servlet Filters. However, instead of registering dozens of individual security filters directly with the Servlet Container (Tomcat), Spring registers a single, special filter called the **`DelegatingFilterProxy`**.

**How it works:**
1.  The `DelegatingFilterProxy` intercepts the request from the Servlet Container.
2.  It delegates the request into the Spring ApplicationContext to a bean named `FilterChainProxy`.
3.  The `FilterChainProxy` contains one or more **`SecurityFilterChain`**s.
4.  A `SecurityFilterChain` is an ordered list of Spring Security filters (e.g., `CsrfFilter`, `UsernamePasswordAuthenticationFilter`, `AuthorizationFilter`).
5.  The `FilterChainProxy` evaluates the request URL and decides which specific `SecurityFilterChain` should process it. 
6.  The request passes through each filter in the chosen chain sequentially. If a filter blocks the request (e.g., missing authentication), the chain stops.

**Configuration:**
In modern Spring Boot (without `WebSecurityConfigurerAdapter`), you define a `SecurityFilterChain` by creating a `@Bean` of that type:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(withDefaults());
    return http.build();
}
```

### Life Analogy
The Servlet Container (Tomcat) is the main highway.
The `DelegatingFilterProxy` is the exit ramp leading to the Security Checkpoint.
The `FilterChainProxy` is the checkpoint director.
The `SecurityFilterChain` is the actual line of inspection stations. You must pass through the ID check (Auth Filter), the baggage scanner (CSRF Filter), and the ticket verifier (Authorization Filter) sequentially. If you fail any station, you are kicked out.

### Key Points
- Spring Security is built on standard Servlet Filters.
- `DelegatingFilterProxy` bridges the Servlet Container to the Spring Context.
- `SecurityFilterChain` is an ordered list of security filters.
- Defined as a `@Bean` in modern Spring Security configuration.
