/**
 * System Architecture Scenarios & Data Model (4-Layer Grid Topology)
 */

export const SYS_DESIGN_SCENARIOS = [
    {
        id: 'sys-001',
        title: 'Distributed Rate Limiter (Token Bucket & Redis Lua)',
        category: 'Microservices & Security',
        difficulty: 'Senior',
        timeComplexity: 'O(1) per request',
        spaceComplexity: 'O(Users)',
        overview: 'High-throughput rate limiting architecture preventing DDoS and API overuse across microservice clusters using atomic Redis Lua scripts.',
        tags: ['Redis', 'Lua', 'Token Bucket', 'API Gateway', 'Rate Limiting'],
        components: [
            { name: 'API Gateway', role: 'Intercepts incoming HTTP requests and coordinates rate limiting check.' },
            { name: 'Redis Cluster', role: 'Stores atomic token bucket counters with TTL per client IP/User ID.' },
            { name: 'Lua Engine', role: 'Executes atomic check-and-decrement logic inside Redis without race conditions.' },
            { name: 'Backend Service', role: 'Executes core business logic for allowed requests.' },
            { name: 'Primary DB', role: 'Stores primary transactional business entities.' }
        ],
        nodes: [
            { id: 'client', label: 'Client App', type: 'client', x: 40, y: 130, icon: 'fa-laptop' },
            { id: 'gateway', label: 'API Gateway', type: 'gateway', x: 220, y: 130, icon: 'fa-shield-halved' },
            { id: 'redis', label: 'Redis (Lua)', type: 'cache', x: 400, y: 30, icon: 'fa-database' },
            { id: 'backend', label: 'Backend Service', type: 'service', x: 400, y: 230, icon: 'fa-server' },
            { id: 'db', label: 'Primary DB', type: 'db', x: 580, y: 230, icon: 'fa-hard-drive' }
        ],
        connections: [
            { from: 'client', to: 'gateway' },
            { from: 'gateway', to: 'redis' },
            { from: 'gateway', to: 'backend' },
            { from: 'backend', to: 'db' }
        ],
        steps: [
            {
                step: 1,
                title: 'HTTP Request Ingestion',
                activeNode: 'gateway',
                activePath: ['client', 'gateway'],
                badge: 'GET /api/v1/order',
                description: 'Client sends an HTTP request GET /api/v1/order to API Gateway with X-User-ID: 84920 header.',
                log: '[API Gateway] Intercepted request from User #84920. Key: "rate:user:84920".'
            },
            {
                step: 2,
                title: 'Atomic Redis Lua Token Evaluation',
                activeNode: 'redis',
                activePath: ['gateway', 'redis'],
                badge: 'EVAL Lua (Token Check)',
                description: 'Gateway executes atomic Lua script in Redis. Checks tokens vs refill timestamp.',
                log: '[Redis Cluster] Running Lua script. Tokens: 4/10. Refill rate: 2 tokens/sec. Token available!'
            },
            {
                step: 3,
                title: 'Token Decrement & Forwarding',
                activeNode: 'backend',
                activePath: ['gateway', 'backend'],
                badge: 'Token -1 -> Forward',
                description: 'Token count decremented to 3. Gateway forwards request downstream to Order-Service.',
                log: '[API Gateway] Rate check PASSED. Tokens remaining: 3. Forwarding to Order-Service.'
            },
            {
                step: 4,
                title: 'Business Execution & DB Access',
                activeNode: 'db',
                activePath: ['backend', 'db'],
                badge: '200 OK (3ms)',
                description: 'Backend microservice processes request and fetches data from Primary Database.',
                log: '[Order-Service] Queried PostgreSQL DB (3ms). Returning 200 OK payload.'
            },
            {
                step: 5,
                title: 'Rate Limit Exhaustion (429 Scenario)',
                activeNode: 'gateway',
                activePath: ['gateway', 'client'],
                badge: '429 Too Many Requests',
                description: 'When token count hits 0, Gateway rejects request immediately with 429 Too Many Requests.',
                log: '[API Gateway] Tokens = 0. Request REJECTED. Returning 429 Too Many Requests (Retry-After: 2s).'
            }
        ],
        interviewPitfalls: [
            'Race Conditions: Non-atomic GET and SET operations in Redis cause burst leaks. Fix: Execute Lua script atomically inside Redis.',
            'Clock Drift: Relying on system clocks across distributed nodes causes uneven refills. Fix: Use Redis SERVER TIME as authoritative clock.',
            'Memory Exhaustion: Inactive IP keys accumulate in Redis. Fix: Set strict TTL (e.g. 60 seconds) on every rate limit key.'
        ],
        javaCode: `// Production Spring Boot Redis Lua Rate Limiter
@Component
public class RedisRateLimiter {
    private final StringRedisTemplate redisTemplate;
    private final RedisScript<Long> rateLimitScript;

    public RedisRateLimiter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.rateLimitScript = new DefaultRedisScript<>(
            "local key = KEYS[1] " +
            "local limit = tonumber(ARGV[1]) " +
            "local current = tonumber(redis.call('get', key) or '0') " +
            "if current + 1 > limit then return 0 " +
            "else " +
            "   redis.call('INCRBY', key, 1) " +
            "   if current == 0 then redis.call('EXPIRE', key, 1) end " +
            "   return 1 " +
            "end", Long.class);
    }

    public boolean isAllowed(String userId, int maxRequestsPerSec) {
        String key = "rate:user:" + userId;
        Long result = redisTemplate.execute(rateLimitScript, Collections.singletonList(key), String.valueOf(maxRequestsPerSec));
        return result != null && result == 1L;
    }
}`
    },
    {
        id: 'sys-002',
        title: 'Kafka Non-Blocking Retry & Dead Letter Queue (DLQ)',
        category: 'Event-Driven & Messaging',
        difficulty: 'Senior',
        timeComplexity: 'O(1) async messaging',
        spaceComplexity: 'O(Retention)',
        overview: 'Resilient event consumption strategy using delayed retry topics and DLQ to prevent poison pill messages from blocking Kafka partitions.',
        tags: ['Kafka', 'DLQ', 'Microservices', 'Resilience', 'Event-Driven'],
        components: [
            { name: 'Order Producer', role: 'Publishes new order events to main Kafka topic.' },
            { name: 'Main Topic (orders)', role: 'Primary event stream partitioned across Kafka brokers.' },
            { name: 'Consumer Service', role: 'Processes order events and writes to Order Database.' },
            { name: 'Retry Topic (1m delay)', role: 'Holds failed events for delayed 1-minute retry attempt.' },
            { name: 'Dead Letter Queue (DLQ)', role: 'Holds persistently failing poison pill messages for manual inspection.' }
        ],
        nodes: [
            { id: 'producer', label: 'Order Producer', type: 'service', x: 40, y: 130, icon: 'fa-paper-plane' },
            { id: 'maintopic', label: 'Topic: orders', type: 'queue', x: 220, y: 30, icon: 'fa-layer-group' },
            { id: 'consumer', label: 'Order Consumer', type: 'service', x: 400, y: 130, icon: 'fa-gears' },
            { id: 'retrytopic', label: 'Retry Topic', type: 'queue', x: 220, y: 230, icon: 'fa-clock' },
            { id: 'dlq', label: 'DLQ Topic', type: 'queue', x: 580, y: 230, icon: 'fa-skull' }
        ],
        connections: [
            { from: 'producer', to: 'maintopic' },
            { from: 'maintopic', to: 'consumer' },
            { from: 'consumer', to: 'retrytopic' },
            { from: 'retrytopic', to: 'consumer' },
            { from: 'consumer', to: 'dlq' }
        ],
        steps: [
            {
                step: 1,
                title: 'Event Publication to Main Topic',
                activeNode: 'maintopic',
                activePath: ['producer', 'maintopic'],
                badge: 'Publish OrderCreated',
                description: 'Producer publishes OrderCreatedEvent to partition 0 of main topic "orders".',
                log: '[Kafka Producer] Published event OrderId=#9821 to topic "orders" [Partition 0, Offset 1042].'
            },
            {
                step: 2,
                title: 'Consumer Execution & Transient Failure',
                activeNode: 'consumer',
                activePath: ['maintopic', 'consumer'],
                badge: '504 Connection Timeout',
                description: 'Order Consumer fetches event. Downstream Payment Gateway times out (504 Gateway Timeout).',
                log: '[Order Consumer] Processing OrderId=#9821 failed! Payment API Connection Refused (Attempt 1/3).'
            },
            {
                step: 3,
                title: 'Non-Blocking Forward to Retry Topic',
                activeNode: 'retrytopic',
                activePath: ['consumer', 'retrytopic'],
                badge: 'Commit & Forward Retry',
                description: 'Consumer commits main partition offset immediately and routes message to "orders-retry-1m". Main topic stays unblocked!',
                log: '[Kafka Consumer] Offset 1042 COMMITTED. Forwarded OrderId=#9821 to "orders-retry-1m" (Backoff: 60s).'
            },
            {
                step: 4,
                title: 'Delayed Retry Attempt',
                activeNode: 'consumer',
                activePath: ['retrytopic', 'consumer'],
                badge: 'Retry Attempt 3/3',
                description: 'Retry Consumer picks up event after 1-minute delay. Retries payment processing.',
                log: '[Retry Consumer] Re-processing OrderId=#9821 after 60s backoff. Connection still failing.'
            },
            {
                step: 5,
                title: 'DLQ Escrow for Poison Pills',
                activeNode: 'dlq',
                activePath: ['consumer', 'dlq'],
                badge: 'Escrowed in DLQ',
                description: 'After 3 failed retries, message is moved to "orders-dlq" for alerting and admin re-drive.',
                log: '[Kafka Container] Max retries (3) exceeded! Moved OrderId=#9821 to "orders-dlq". Alert triggered to Slack.'
            }
        ],
        interviewPitfalls: [
            'Blocking Main Partition: Sleeping thread inside consumer blocks all subsequent partition messages. Fix: Use non-blocking retry topics.',
            'Infinite Loops: Retrying unrecoverable validation errors (e.g. Null Pointer / Bad JSON) wastes CPU. Fix: Route non-retryable exceptions directly to DLQ.',
            'Order Out-Of-Sequence: Retry topics change processing order. Fix: Implement idempotent processing keys or state machine checks.'
        ],
        javaCode: `// Spring Kafka Non-Blocking Retry & DLQ Configuration
@Configuration
public class KafkaRetryConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderEvent> kafkaListenerContainerFactory(
            ConsumerFactory<String, OrderEvent> consumerFactory,
            KafkaTemplate<String, Object> kafkaTemplate) {
        
        ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);

        // Exponential Backoff: 1s, 2s, 4s then DLQ
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate),
            new ExponentialBackOffWithMaxRetries(3)
        );
        errorHandler.addNotRetryableExceptions(IllegalArgumentException.class);

        factory.setCommonErrorHandler(errorHandler);
        return factory;
    }
}`
    },
    {
        id: 'sys-003',
        title: 'Cache Stampede Protection (Mutex Locking & XFetch)',
        category: 'Caching & Database',
        difficulty: 'Senior',
        timeComplexity: 'O(1) cache / O(log N) lock',
        spaceComplexity: 'O(Keys)',
        overview: 'Prevents Thundering Herd problems when high-traffic cache keys expire by using distributed locks and probabilistic early refresh.',
        tags: ['Redis', 'Caching', 'Thundering Herd', 'Locking', 'PostgreSQL'],
        components: [
            { name: 'Load Balancer', role: 'Distributes 10,000 concurrent client requests across app pods.' },
            { name: 'Application Pods', role: 'Worker nodes attempting to read hot cache key.' },
            { name: 'Redis Cache', role: 'Holds key "top-products" with TTL = 60s.' },
            { name: 'Distributed Lock', role: 'Ensures only 1 application pod queries DB when cache expires.' },
            { name: 'PostgreSQL DB', role: 'Primary database protected from query spikes.' }
        ],
        nodes: [
            { id: 'client', label: '10k Clients', type: 'client', x: 40, y: 130, icon: 'fa-users' },
            { id: 'app', label: 'App Pods', type: 'service', x: 220, y: 130, icon: 'fa-cubes' },
            { id: 'redis', label: 'Redis Cache', type: 'cache', x: 400, y: 30, icon: 'fa-bolt' },
            { id: 'lock', label: 'Mutex Lock', type: 'lock', x: 400, y: 230, icon: 'fa-lock' },
            { id: 'db', label: 'PostgreSQL', type: 'db', x: 580, y: 230, icon: 'fa-database' }
        ],
        connections: [
            { from: 'client', to: 'app' },
            { from: 'app', to: 'redis' },
            { from: 'app', to: 'lock' },
            { from: 'app', to: 'db' }
        ],
        steps: [
            {
                step: 1,
                title: 'Hot Key Expiration Spike',
                activeNode: 'redis',
                activePath: ['client', 'app', 'redis'],
                badge: 'TTL EXPIRED (Cache Miss)',
                description: 'Hot key "top-products" (viewed by 10,000 users/sec) expires in Redis.',
                log: '[Redis] Key "top-products" TTL EXPIRED. 10,000 concurrent threads detect Cache Miss.'
            },
            {
                step: 2,
                title: 'Distributed Mutex Lock Acquisition',
                activeNode: 'lock',
                activePath: ['app', 'lock'],
                badge: 'Acquire Lock (Pod #1)',
                description: 'App Pod #1 acquires Redis lock "lock:top-products". Pods #2..#1000 wait or read stale data.',
                log: '[App Pod #1] SET lock:top-products NX PX 3000 -> SUCCESS. Pod #1 selected to recalculate cache.'
            },
            {
                step: 3,
                title: 'Single DB Query Execution',
                activeNode: 'db',
                activePath: ['app', 'db'],
                badge: 'Single Query (DB CPU 5%)',
                description: 'Only Pod #1 queries PostgreSQL database. Primary DB CPU stays low at 5%!',
                log: '[App Pod #1] Executing query: SELECT * FROM products ORDER BY sales DESC LIMIT 20 (DB load normal).'
            },
            {
                step: 4,
                title: 'Cache Update & Lock Release',
                activeNode: 'redis',
                activePath: ['app', 'redis'],
                badge: 'SET top-products (TTL 60s)',
                description: 'Pod #1 writes fresh data to Redis with new 60s TTL and releases distributed lock.',
                log: '[App Pod #1] SET top-products payload (TTL 60s). Lock "lock:top-products" RELEASED.'
            },
            {
                step: 5,
                title: 'Probabilistic Early Refresh (XFetch)',
                activeNode: 'app',
                activePath: ['redis', 'app'],
                badge: 'XFetch Background Early Refresh',
                description: 'Before TTL expires, pods probabilistically compute refresh: -beta * log(rand()). Cache is refreshed in background before expiring!',
                log: '[XFetch Algorithm] Computed delta * beta > TTL. Background thread refreshed cache 2s before expiry.'
            }
        ],
        interviewPitfalls: [
            'Thundering Herd: 10,000 threads hitting DB at once causes Connection Pool exhaustion & DB crash. Fix: Distributed Lock or Singleflight.',
            'Deadlocks on Crashed Lock: App Pod crashes while holding lock. Fix: Always set lease TTL on Redis lock (e.g. 3s).',
            'Dogpiling on Lock Expiry: Multiple pods sleeping and retrying lock simultaneously. Fix: Use probabilistic early recomputation (XFetch).'
        ],
        javaCode: `// Redisson Lock Pattern for Cache Stampede Protection
@Service
public class ProductService {
    @Autowired private RedissonClient redisson;
    @Autowired private StringRedisTemplate redisTemplate;
    @Autowired private ProductRepository productRepository;

    public String getTopProducts() {
        String cacheKey = "top-products";
        String cachedData = redisTemplate.opsForValue().get(cacheKey);
        
        if (cachedData != null) return cachedData;

        // Acquire Distributed Lock to prevent Thundering Herd
        RLock lock = redisson.getLock("lock:" + cacheKey);
        try {
            if (lock.tryLock(2, 5, TimeUnit.SECONDS)) {
                try {
                    // Double check cache after acquiring lock
                    cachedData = redisTemplate.opsForValue().get(cacheKey);
                    if (cachedData != null) return cachedData;

                    // Query DB once
                    String dbData = productRepository.findTop20Json();
                    redisTemplate.opsForValue().set(cacheKey, dbData, 60, TimeUnit.SECONDS);
                    return dbData;
                } finally {
                    lock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Fallback to stale data or retry
        return redisTemplate.opsForValue().get(cacheKey);
    }
}`
    },
    {
        id: 'sys-004',
        title: 'Database Sharding & Consistent Hashing',
        category: 'Databases & Scaling',
        difficulty: 'Architect',
        timeComplexity: 'O(log N) lookup',
        spaceComplexity: 'O(Nodes)',
        overview: 'Horizontal database scaling architecture distributing billions of user records across sharded DB nodes using Consistent Hash Rings.',
        tags: ['Sharding', 'Consistent Hashing', 'PostgreSQL', 'Vitess', 'Horizontal Scaling'],
        components: [
            { name: 'User Client', role: 'Sends SQL query with shard key (e.g. user_id = 84920).' },
            { name: 'Sharding Proxy (Vitess)', role: 'Calculates hash(shard_key) and routes query to target shard.' },
            { name: 'Consistent Hash Ring', role: 'Maps 360-degree hash space to virtual database node positions.' },
            { name: 'Shard 1 DB (0..100k)', role: 'Database cluster hosting users 0 to 100,000.' },
            { name: 'Shard 2 DB (100k..200k)', role: 'Database cluster hosting users 100,001 to 200,000.' }
        ],
        nodes: [
            { id: 'client', label: 'Client App', type: 'client', x: 40, y: 130, icon: 'fa-user' },
            { id: 'proxy', label: 'Shard Proxy', type: 'gateway', x: 220, y: 130, icon: 'fa-network-wired' },
            { id: 'ring', label: 'Hash Ring', type: 'cache', x: 400, y: 30, icon: 'fa-circle-nodes' },
            { id: 'shard1', label: 'Shard #1', type: 'db', x: 580, y: 30, icon: 'fa-database' },
            { id: 'shard2', label: 'Shard #2', type: 'db', x: 580, y: 230, icon: 'fa-database' }
        ],
        connections: [
            { from: 'client', to: 'proxy' },
            { from: 'proxy', to: 'ring' },
            { from: 'proxy', to: 'shard2' },
            { from: 'ring', to: 'shard1' }
        ],
        steps: [
            {
                step: 1,
                title: 'SQL Query & Shard Key Extraction',
                activeNode: 'proxy',
                activePath: ['client', 'proxy'],
                badge: 'Extract user_id=84920',
                description: 'Client executes query "SELECT * FROM users WHERE user_id = 84920". Proxy extracts shard key 84920.',
                log: '[Sharding Proxy] Received query. Extracted Shard Key: user_id = 84920.'
            },
            {
                step: 2,
                title: 'Consistent Hash Calculation',
                activeNode: 'ring',
                activePath: ['proxy', 'ring'],
                badge: 'Hash -> Virtual Node Shard2',
                description: 'Proxy computes MurmurHash3("84920") = 0x7F4A2109 and looks up position on Consistent Hash Ring.',
                log: '[Consistent Hash Ring] Hash: 0x7F4A2109 -> Clockwise traversal points to Virtual Node Shard2_V3.'
            },
            {
                step: 3,
                title: 'Direct Shard Query Routing',
                activeNode: 'shard2',
                activePath: ['proxy', 'shard2'],
                badge: 'Query Shard #2 (2ms)',
                description: 'Proxy routes SQL query directly to Shard Node #2 without querying Shard Node #1.',
                log: '[Sharding Proxy] Routing query to Shard Node #2 (10.0.2.15:5432). Response time: 2ms.'
            },
            {
                step: 4,
                title: 'Adding New Shard (Zero Downtime)',
                activeNode: 'shard1',
                activePath: ['ring', 'shard1'],
                badge: 'Remap 25% Keys (Zero Downtime)',
                description: 'When Shard #3 is added to Hash Ring, only 1/N keys (25%) are remapped without full database migration.',
                log: '[Hash Ring Migration] Shard #3 registered. Only 25% of hash range reassigned. Zero downtime!'
            }
        ],
        interviewPitfalls: [
            'Modulus Sharding (hash % N): Adding 1 server remaps 99% of keys, causing massive cache/db thrashing. Fix: Use Consistent Hashing.',
            'Cross-Shard Joins: Joining tables across 2 different database shards is extremely slow. Fix: Co-locate related data by shard key (e.g. tenant_id).',
            'Hotspot Shards: Celebrities or viral accounts overwhelm a single shard. Fix: Salt shard key for high-volume accounts (user_id + "_" + rand(4)).'
        ],
        javaCode: `// Consistent Hashing Implementation with Virtual Nodes
public class ConsistentHashRing<T> {
    private final HashFunction hashFunction = Hashing.murmur3_128();
    private final int numberOfReplicas; // Virtual nodes per physical shard
    private final ConcurrentSkipListMap<Long, T> circle = new ConcurrentSkipListMap<>();

    public ConsistentHashRing(int numberOfReplicas, Collection<T> nodes) {
        this.numberOfReplicas = numberOfReplicas;
        for (T node : nodes) {
            addShard(node);
        }
    }

    public void addShard(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hashFunction.hashString(node.toString() + "-VN" + i, StandardCharsets.UTF_8).asLong();
            circle.put(hash, node);
        }
    }

    public T getShard(String key) {
        if (circle.isEmpty()) return null;
        long hash = hashFunction.hashString(key, StandardCharsets.UTF_8).asLong();
        Long targetHash = circle.ceilingKey(hash);
        if (targetHash == null) {
            targetHash = circle.firstKey(); // Wrap around circle
        }
        return circle.get(targetHash);
    }
}`
    },
    {
        id: 'sys-005',
        title: 'Real-Time Location Tracker (Uber GeoHash & Spatial Index)',
        category: 'Geo-Spatial & Real-Time',
        difficulty: 'Senior',
        timeComplexity: 'O(log N) spatial lookup',
        spaceComplexity: 'O(Active Drivers)',
        overview: 'Low-latency spatial location tracking architecture querying nearest drivers within a 2km radius using GeoHash indexing and In-Memory Spatial Trees.',
        tags: ['GeoHash', 'Redis GEO', 'WebSockets', 'Spatial Index', 'Uber'],
        components: [
            { name: 'Passenger App', role: 'Requests nearest drivers at GPS coordinates (lat, lon).' },
            { name: 'WebSocket Gateway', role: 'Maintains bi-directional persistent connections with active drivers.' },
            { name: 'Geo Location Service', role: 'Converts GPS coordinates into 6-character GeoHash grid strings.' },
            { name: 'Redis GEO Index', role: 'Stores driver locations in in-memory Sorted Sets with 2D spatial encoding.' },
            { name: 'Driver App Ping', role: 'Streams driver location ping every 4 seconds.' }
        ],
        nodes: [
            { id: 'passenger', label: 'Passenger App', type: 'client', x: 40, y: 130, icon: 'fa-mobile-screen' },
            { id: 'ws', label: 'WS Gateway', type: 'gateway', x: 220, y: 130, icon: 'fa-plug' },
            { id: 'geoservice', label: 'Geo Service', type: 'service', x: 400, y: 130, icon: 'fa-map-location-dot' },
            { id: 'redisgeo', label: 'Redis GEO', type: 'cache', x: 580, y: 30, icon: 'fa-location-crosshairs' },
            { id: 'driver', label: 'Driver App', type: 'client', x: 580, y: 230, icon: 'fa-car' }
        ],
        connections: [
            { from: 'driver', to: 'ws' },
            { from: 'passenger', to: 'ws' },
            { from: 'ws', to: 'geoservice' },
            { from: 'geoservice', to: 'redisgeo' }
        ],
        steps: [
            {
                step: 1,
                title: 'Driver Location Stream Ping',
                activeNode: 'ws',
                activePath: ['driver', 'ws'],
                badge: 'Ping (37.7749, -122.4194)',
                description: 'Driver App streams current GPS coordinates (lat: 37.7749, lon: -122.4194) over WebSocket every 4s.',
                log: '[WebSocket Gateway] Driver #4021 ping: (37.7749, -122.4194). Forwarding to Geo Service.'
            },
            {
                step: 2,
                title: 'GeoHash Cell Encoding',
                activeNode: 'geoservice',
                activePath: ['ws', 'geoservice'],
                badge: 'GeoHash: "dp9q8v"',
                description: 'Geo Service converts coordinates to 6-char GeoHash string "dp9q8v" representing a ~1.2km x 0.6km grid box.',
                log: '[Geo Location Service] Encoded coordinates (37.7749, -122.4194) -> GeoHash cell: "dp9q8v".'
            },
            {
                step: 3,
                title: 'In-Memory Spatial Index Update',
                activeNode: 'redisgeo',
                activePath: ['geoservice', 'redisgeo'],
                badge: 'GEOADD driver_locations (<1ms)',
                description: 'Service executes GEOADD driver_locations -122.4194 37.7749 driver_4021 in Redis.',
                log: '[Redis GEO] Executed GEOADD driver_locations. Spatial index updated in <1ms.'
            },
            {
                step: 4,
                title: 'Radius Query (8 Neighbor Cells)',
                activeNode: 'geoservice',
                activePath: ['passenger', 'ws', 'geoservice'],
                badge: 'GEORADIUS 2km',
                description: 'Passenger requests ride. Geo Service queries Redis GEORADIUS for 8 neighboring cells within 2km.',
                log: '[Geo Service] GEORADIUSBYMEMBER driver_locations passenger_coords 2 km WITHDIST ASC.'
            },
            {
                step: 5,
                title: 'Sub-5ms Driver Match Response',
                activeNode: 'passenger',
                activePath: ['geoservice', 'passenger'],
                badge: '5 Drivers Match (4ms)',
                description: 'Returns 5 nearest drivers (Driver #4021: 0.3km away). Total end-to-end latency: 4ms.',
                log: '[Passenger App] Found 5 drivers nearby! Closest: Driver #4021 (300m away).'
            }
        ],
        interviewPitfalls: [
            'Boundary Edge Cases: 2 points 5 meters apart across a GeoHash cell border have completely different prefixes. Fix: Always query the 8 adjacent neighbor cells.',
            'Database IO Bottleneck: Writing 500,000 driver location pings/sec directly to relational DB will crash disk IO. Fix: Buffer pings in Redis GEO in-memory and flush asynchronously.',
            'Stale Driver Locations: Inactive drivers remain in index. Fix: Set driver TTL or clean up driver keys if no ping received within 30 seconds.'
        ],
        javaCode: `// Spring Data Redis GEO Location Tracking Service
@Service
public class GeoTrackingService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String GEO_KEY = "drivers:active";

    // 1. Update Driver Location
    public void updateDriverLocation(String driverId, double lat, double lon) {
        redisTemplate.opsForGeo().add(GEO_KEY, new Point(lon, lat), driverId);
    }

    // 2. Find Nearest Drivers within Radius (e.g. 2km)
    public List<NearestDriver> findNearestDrivers(double lat, double lon, double radiusKm) {
        Circle area = new Circle(new Point(lon, lat), new Distance(radiusKm, RedisGeoCommands.DistanceUnit.KILOMETERS));
        GeoResults<RedisGeoCommands.GeoLocation<String>> results = redisTemplate.opsForGeo()
                .search(GEO_KEY, area, RedisGeoCommands.GeoSearchCommandArgs.newGeoSearchArgs().includeDistance().sortAscending().limit(5));

        List<NearestDriver> drivers = new ArrayList<>();
        if (results != null) {
            for (GeoResult<RedisGeoCommands.GeoLocation<String>> result : results) {
                drivers.add(new NearestDriver(
                    result.getContent().getName(),
                    result.getDistance().getValue()
                ));
            }
        }
        return drivers;
    }
}`
    }
];
