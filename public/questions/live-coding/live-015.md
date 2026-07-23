---
id: live-015
path: questions/live-coding/live-015.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Custom Spring Security JWT Filter
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

You need to implement a custom Spring Security filter that extracts a JWT from the `Authorization` header, validates it, and sets the `SecurityContext` if valid.

**Requirements:**
1. Extract token from `Authorization: Bearer <token>`.
2. Assume a `JwtService.validate(String token)` and `JwtService.getUsername(String token)` exist.
3. If token is missing or invalid, just proceed the filter chain (don't set context).

### Challenge
Write the `OncePerRequestFilter` implementation.

---

### Solution

**Explanation:**
We extend `OncePerRequestFilter` to ensure it only fires once per HTTP request. We inspect the header, strip the "Bearer " prefix, validate, and inject an `Authentication` token into the `SecurityContextHolder`.

**Implementation:**

```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService; // Provided

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        
        if (jwtService.validate(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
            String username = jwtService.getUsername(jwt);
            
            // Assuming no roles for simplicity in this example
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
            
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        
        filterChain.doFilter(request, response);
    }
}
```
