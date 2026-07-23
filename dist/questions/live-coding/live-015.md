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

# Custom Spring Security JWT Filter
We implemented a custom JWT authentication filter in Spring Security by extending `GenericFilterBean`. It extracts the token from the `Authorization` header, validates it, and sets the `SecurityContext`. However, we noticed that for certain API endpoints, the filter is being executed twice per request, causing redundant database lookups for user details.

Can you explain why the filter might be executing multiple times and refactor the code to ensure it only runs exactly once per request?

---ANSWER---

In Servlet-based applications, a request can be dispatched multiple times internally (e.g., via `FORWARD`, `INCLUDE`, or `ERROR` dispatches). If a filter implements standard interfaces like `Filter` or `GenericFilterBean`, the Servlet container might invoke it on every internal dispatch, resulting in multiple executions for a single logical client request.

Spring provides a specialized abstract class to solve this exact problem: `OncePerRequestFilter`. 
By extending `OncePerRequestFilter` instead of `GenericFilterBean`, Spring guarantees that the `doFilterInternal` method will be executed exactly once per client request, regardless of internal forwards or error dispatches. It does this internally by setting a specific request attribute (a flag) the first time it runs and checking that flag on subsequent dispatches.

Additionally, when setting the authentication context, it is a best practice to first check if an authentication already exists in the `SecurityContextHolder` to avoid overwriting existing authentications unnecessarily.

### Examples
```java
// BUGGY CODE:
public class JwtAuthFilter extends GenericFilterBean {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
            
        HttpServletRequest req = (HttpServletRequest) request;
        String token = req.getHeader("Authorization");
        
        if (token != null && jwtUtils.validate(token)) {
            // Expensive DB call happening multiple times!
            UserDetails user = userDetailsService.loadUserByUsername(jwtUtils.getUser(token));
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
            );
        }
        chain.doFilter(request, response);
    }
}

// REFACTORED CODE:
public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
                                    throws ServletException, IOException {
                                    
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Also ensure we don't overwrite existing auth
            if (jwtUtils.validate(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                String username = jwtUtils.getUser(token);
                UserDetails user = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                // Important for WebSecurity details
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### Life Analogy
Imagine a VIP club where a bouncer (the filter) checks your ID at the front door. Sometimes, to go from the bar to the lounge (an internal server forward), you have to pass through another hallway. 
`GenericFilterBean` is like having a bouncer check your ID at the front door, and then again every time you walk down a hallway inside the club. 
`OncePerRequestFilter` is like the bouncer checking your ID at the front door and giving you a wristband. When you walk down the hallways, the internal security sees the wristband and lets you pass without checking your ID again.

### Key Points
- Always extend `OncePerRequestFilter` instead of `GenericFilterBean` or `Filter` for Spring Security authentication filters.
- `OncePerRequestFilter` guarantees a single execution per logical request, preventing expensive redundant operations like token parsing or DB lookups.
- Ensure you pass the request down the chain via `filterChain.doFilter(request, response)`.
