---
id: spring-059
topic: Spring
difficulty: Middle
format: Open Answer
time: 10
frequency: 90%
source: Verdict Review
prerequisites: ["Spring Security", "JWT", "Authentication"]
tags: ['verdict-review', 'security', 'jwt']
---

# JWT Lifecycle: Generation, Stateless Validation, and Refresh Token Rotation

Explain the full lifecycle of JWT authentication in a Spring Boot application. Why must Access Tokens be short-lived, how does Refresh Token Rotation mitigate token theft, and where should tokens be validated in the Spring Security Filter Chain?

---ANSWER---

JSON Web Tokens (JWT) enable stateless authentication in microservices and modern SPAs, eliminating the need to store session state in server memory.

### Anatomy of JWT
A JWT consists of three Base64Url-encoded parts separated by dots:
1. **Header:** Algorithm and token type (`{"alg": "HS256", "typ": "JWT"}`).
2. **Payload (Claims):** Subject (`sub`), expiration (`exp`), issued-at (`iat`), and roles/authorities.
3. **Signature:** `HMACSHA256(header + "." + payload, secretKey)`.

### Why Access Tokens Must Be Short-Lived
Because JWTs are stateless, they **cannot be revoked instantly** by the server without introducing a centralized blacklist (which destroys statelessness). If an Access Token is intercepted:
- An attacker has full access until `exp`.
- Therefore, Access Tokens should expire in **10–15 minutes**.

### Refresh Token Rotation (RTR)
To avoid forcing users to re-login every 15 minutes, long-lived **Refresh Tokens** (e.g., 7–30 days) are used:
1. **Storage:** Refresh tokens are stored in the database hashed, tied to a `user_id` and a `family_id` (or device).
2. **Rotation Mechanism:** Every time `/api/auth/refresh` is called, the current Refresh Token is **invalidated** and a brand-new Refresh Token + Access Token pair is issued.
3. **Breach Detection:** If an invalidated Refresh Token is presented again, the server detects a replay attack and immediately **revokes the entire token family**, logging out all sessions for that user.

### Spring Security Integration (Filter Order)
Authentication is handled by a custom `JwtAuthenticationFilter` extending `OncePerRequestFilter`:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        final String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

This filter must be registered **before** `UsernamePasswordAuthenticationFilter`:
```java
http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

### Key Takeaways
- Access Tokens: short-lived (15 min), stored in memory or secure HttpOnly cookie.
- Refresh Tokens: rotated upon every usage, tracked in DB to detect reuse attacks.
- Registered via `OncePerRequestFilter` prior to `UsernamePasswordAuthenticationFilter`.\n