---
id: spring-060
topic: Spring
difficulty: Middle
format: Open Answer
time: 8
frequency: 85%
source: Verdict Review
prerequisites: ["CORS", "Spring Security", "HTTP Preflight"]
tags: ['verdict-review', 'security', 'cors']
---

# CORS Configuration in Spring Security: Preflight OPTIONS and Filter Order

Why does putting `@CrossOrigin` on Spring MVC Controllers often fail to resolve CORS errors when Spring Security is enabled? How do HTTP Preflight `OPTIONS` requests interact with the Security Filter Chain, and what is the proper configuration?

---ANSWER---

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts cross-origin HTTP requests.

### Why `@CrossOrigin` Fails with Spring Security
1. **Filter Execution Order:** Spring Security's `SecurityFilterChain` executes **before** Spring MVC's `DispatcherServlet`.
2. When a browser initiates a complex request (e.g. `POST` with `Authorization: Bearer <token>` or `Content-Type: application/json`), it first issues a preflight `OPTIONS` request.
3. Preflight requests **do not contain authentication headers** (no `Bearer` token).
4. If Spring Security requires authentication on `anyRequest().authenticated()`, the `OPTIONS` request is rejected with `401 Unauthorized` or `403 Forbidden` at the security filter level — **before** it ever reaches the controller where `@CrossOrigin` is annotated.

### The Correct Canonical Configuration
Configure a `CorsConfigurationSource` bean and attach it directly to `HttpSecurity`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflights
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://frontend.domain.com", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### Critical Security Gotcha: `allowCredentials(true)`
When `allowCredentials` is set to `true` (allowing cookies or Authorization headers), the browser specification **strictly prohibits** using the wildcard `allowedOrigins("*")`. You must provide an explicit list of origins or use `setAllowedOriginPatterns(List.of("https://*.mydomain.com"))`.

### Key Takeaways
- Spring Security filters run before Spring MVC controllers; controller-level `@CrossOrigin` cannot handle preflights if Security blocks them.
- Always configure CORS at the `HttpSecurity` level via `CorsConfigurationSource`.
- Never use wildcard `*` origins together with `allowCredentials(true)`.\n