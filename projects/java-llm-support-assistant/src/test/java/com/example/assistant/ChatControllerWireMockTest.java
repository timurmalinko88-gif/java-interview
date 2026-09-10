package com.example.assistant;

import com.example.assistant.client.Sleeper;
import com.example.assistant.dto.ChatRequest;
import com.example.assistant.dto.ChatResponse;
import com.example.assistant.dto.ErrorResponseDto;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.stubbing.Scenario;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.atomic.AtomicInteger;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ChatControllerWireMockTest {

    static WireMockServer wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());

    @BeforeAll
    static void startWireMock() {
        wireMockServer.start();
    }

    @AfterAll
    static void stopWireMock() {
        wireMockServer.stop();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("llm.base-url", () -> "http://localhost:" + wireMockServer.port());
        registry.add("llm.api-key", () -> "test-key-12345");
        registry.add("llm.timeout-seconds", () -> 5);
        registry.add("llm.max-retries", () -> 2);
        registry.add("llm.max-loop-iterations", () -> 5);
    }

    static final AtomicInteger sleepCount = new AtomicInteger();

    @TestConfiguration
    static class SleeperTestConfig {
        @Bean
        @Primary
        public Sleeper testSleeper() {
            return millis -> sleepCount.incrementAndGet();
        }
    }

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void resetWireMock() {
        wireMockServer.resetAll();
        sleepCount.set(0);
    }

    @Test
    @DisplayName("Unauthenticated request to /api/ai/chat returns 401 Unauthorized")
    void unauthenticatedFails() throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // 1. Missing Authorization header
        HttpRequest noAuthReq = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:" + port + "/api/ai/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"message\":\"Hello\"}"))
                .build();
        HttpResponse<String> noAuthResp = client.send(noAuthReq, HttpResponse.BodyHandlers.ofString());
        assertEquals(401, noAuthResp.statusCode());

        // 2. Bad credentials in Authorization header
        String badCreds = java.util.Base64.getEncoder().encodeToString("invalid_user:wrong_password".getBytes());
        HttpRequest badAuthReq = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:" + port + "/api/ai/chat"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Basic " + badCreds)
                .POST(HttpRequest.BodyPublishers.ofString("{\"message\":\"Hello\"}"))
                .build();
        HttpResponse<String> badAuthResp = client.send(badAuthReq, HttpResponse.BodyHandlers.ofString());
        assertEquals(401, badAuthResp.statusCode());
    }

    @Test
    @DisplayName("Simple text completion without tool calls returns 200 OK")
    void simpleTextCompletion() {
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-1",
                                  "model": "gpt-4o-mini",
                                  "choices": [
                                    {
                                      "index": 0,
                                      "message": {
                                        "role": "assistant",
                                        "content": "Hello! How can I help you today?"
                                      },
                                      "finish_reason": "stop"
                                    }
                                  ],
                                  "usage": {
                                    "prompt_tokens": 15,
                                    "completion_tokens": 8,
                                    "total_tokens": 23
                                  }
                                }
                                """)));

        ChatRequest req = new ChatRequest("Hello assistant", "conv-1");
        ResponseEntity<ChatResponse> response = restTemplate
                .withBasicAuth("alice", "password")
                .postForEntity("/api/ai/chat", req, ChatResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Hello! How can I help you today?", response.getBody().reply());
        assertTrue(response.getBody().toolCallsExecuted().isEmpty());
        assertEquals(1, response.getBody().iterations());
        assertEquals(23, response.getBody().usage().totalTokens());
    }

    @Test
    @DisplayName("Multi-turn Tool Calling: model requests check_service_status, app executes tool, model answers")
    void multiTurnToolCalling() {
        // Step 1: Model requests tool call
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .inScenario("ToolCallScenario")
                .whenScenarioStateIs(Scenario.STARTED)
                .willSetStateTo("ToolReturned")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-tool-1",
                                  "model": "gpt-4o-mini",
                                  "choices": [
                                    {
                                      "index": 0,
                                      "message": {
                                        "role": "assistant",
                                        "tool_calls": [
                                          {
                                            "id": "call_status_99",
                                            "type": "function",
                                            "function": {
                                              "name": "check_service_status",
                                              "arguments": "{\\"service_name\\":\\"billing\\"}"
                                            }
                                          }
                                        ]
                                      },
                                      "finish_reason": "tool_calls"
                                    }
                                  ],
                                  "usage": {"prompt_tokens": 20, "completion_tokens": 10, "total_tokens": 30}
                                }
                                """)));

        // Step 2: Model receives tool result and produces final answer
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .inScenario("ToolCallScenario")
                .whenScenarioStateIs("ToolReturned")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-tool-2",
                                  "model": "gpt-4o-mini",
                                  "choices": [
                                    {
                                      "index": 0,
                                      "message": {
                                        "role": "assistant",
                                        "content": "The billing service is currently DEGRADED due to delayed webhook processing (latency: 840ms)."
                                      },
                                      "finish_reason": "stop"
                                    }
                                  ],
                                  "usage": {"prompt_tokens": 40, "completion_tokens": 25, "total_tokens": 65}
                                }
                                """)));

        ChatRequest req = new ChatRequest("Is billing working?", "conv-2");
        ResponseEntity<ChatResponse> response = restTemplate
                .withBasicAuth("alice", "password")
                .postForEntity("/api/ai/chat", req, ChatResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().reply().contains("billing service is currently DEGRADED"));
        assertEquals(1, response.getBody().toolCallsExecuted().size());
        assertEquals("check_service_status", response.getBody().toolCallsExecuted().get(0).toolName());
        assertEquals("SUCCESS", response.getBody().toolCallsExecuted().get(0).status());
        assertEquals(2, response.getBody().iterations());
        assertEquals(95, response.getBody().usage().totalTokens()); // 30 + 65
    }

    @Test
    @DisplayName("Upstream Provider 401 is mapped to 502 Bad Gateway with PROVIDER_AUTH_ERROR")
    void providerAuthFailureMappedTo502() {
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .willReturn(aResponse()
                        .withStatus(401)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {"error":{"message":"Incorrect API key provided","type":"invalid_request_error","code":"invalid_api_key"}}
                                """)));

        ChatRequest req = new ChatRequest("Check service status", "conv-3");
        ResponseEntity<ErrorResponseDto> response = restTemplate
                .withBasicAuth("alice", "password")
                .postForEntity("/api/ai/chat", req, ErrorResponseDto.class);

        assertEquals(HttpStatus.BAD_GATEWAY, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("PROVIDER_AUTH_ERROR", response.getBody().code());
        assertTrue(response.getBody().message().contains("Upstream LLM provider"));
    }

    @Test
    @DisplayName("Upstream Provider 429 with Retry-After header triggers automatic backoff and retry")
    void providerRateLimitRetriedSuccessfully() {
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .inScenario("RateLimitScenario")
                .whenScenarioStateIs(Scenario.STARTED)
                .willSetStateTo("Retried")
                .willReturn(aResponse()
                        .withStatus(429)
                        .withHeader("Retry-After", "2")
                        .withBody("""
                                {"error":{"message":"Rate limit exceeded","type":"requests","code":"rate_limit_exceeded"}}
                                """)));

        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .inScenario("RateLimitScenario")
                .whenScenarioStateIs("Retried")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-after-retry",
                                  "model": "gpt-4o-mini",
                                  "choices": [
                                    {"index": 0, "message": {"role": "assistant", "content": "Recovered after rate limit!"}, "finish_reason": "stop"}
                                  ],
                                  "usage": {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15}
                                }
                                """)));

        ChatRequest req = new ChatRequest("Trigger rate limit test", "conv-4");
        ResponseEntity<ChatResponse> response = restTemplate
                .withBasicAuth("alice", "password")
                .postForEntity("/api/ai/chat", req, ChatResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Recovered after rate limit!", response.getBody().reply());
        assertTrue(sleepCount.get() >= 1, "Expected sleeper to be invoked during 429 backoff");
    }

    @Test
    @DisplayName("Loop safeguard stops runaway tool-calling loops at max 5 iterations")
    void loopBudgetProtectsAgainstRunawayExecution() {
        // WireMock always returns a tool call request
        wireMockServer.stubFor(post(urlEqualTo("/chat/completions"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-infinite",
                                  "model": "gpt-4o-mini",
                                  "choices": [
                                    {
                                      "index": 0,
                                      "message": {
                                        "role": "assistant",
                                        "tool_calls": [
                                          {
                                            "id": "call_loop_1",
                                            "type": "function",
                                            "function": {
                                              "name": "check_service_status",
                                              "arguments": "{\\"service_name\\":\\"auth\\"}"
                                            }
                                          }
                                        ]
                                      },
                                      "finish_reason": "tool_calls"
                                    }
                                  ],
                                  "usage": {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15}
                                }
                                """)));

        ChatRequest req = new ChatRequest("Run infinite loop test", "conv-5");
        ResponseEntity<ChatResponse> response = restTemplate
                .withBasicAuth("alice", "password")
                .postForEntity("/api/ai/chat", req, ChatResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5, response.getBody().iterations());
        assertTrue(response.getBody().reply().contains("limit reached"));
        assertEquals(5, response.getBody().toolCallsExecuted().size());
    }
}
