---
id: system-design-011
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Networking", "Caching"]
---

# Content Delivery Networks (CDN)

What is a CDN and how does it improve system performance? Explain the concepts of Edge Servers, Push vs. Pull models, and Cache Invalidation.

---ANSWER---

A **CDN (Content Delivery Network)** is a geographically distributed group of servers that work together to provide fast delivery of Internet content (HTML pages, JavaScript files, stylesheets, images, and videos).

- **How it works (Edge Servers)**: Instead of all users fetching data from a central "Origin" server, users are routed to the nearest CDN "Edge Server". Because the edge server is geographically closer to the user, latency is significantly reduced.

**Push vs. Pull Models:**
- **Push CDN**: You proactively upload content to the CDN whenever it changes. The CDN holds it until it expires. Good for large files or content that rarely changes.
- **Pull CDN**: The CDN pulls the content from your origin server the first time a user requests it, caches it, and serves subsequent requests from the cache. Good for sites with a massive amount of dynamic/static content where you can't push everything.

**Cache Invalidation:**
When an image changes, the CDN might still serve the old cached version. To fix this, you must "invalidate" or "purge" the cache via the CDN provider's API. A common workaround is **Cache Busting**: appending a version number to the file name (e.g., `style_v2.css`). The CDN sees this as a brand new file and pulls it from the origin.

### Life Analogy
A CDN is like having a local warehouse for a popular online store. Instead of shipping every package from the main factory in China (Origin), the company keeps stock in local warehouses in every major city (Edge Servers) so customers get their items in 1 day instead of 3 weeks.

### Key Points
- Reduces latency by serving content from servers geographically close to users.
- Offloads traffic from the main origin server.
- Cache busting (versioning filenames) is the easiest way to handle cache invalidation.
