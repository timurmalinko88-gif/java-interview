package com.example.assistant.client;

import com.example.assistant.dto.OpenAiChatRequest;
import com.example.assistant.dto.OpenAiChatResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Robust HTTP Client for OpenAI API.
 * Official Documentation: https://platform.openai.com/docs/api-reference/chat/create
 * Verified Date: 2026-03-01
 */
@Component
public class OpenAiClient {

    private static final Logger log = LoggerFactory.getLogger(OpenAiClient.class);

    private final String baseUrl;
    private final String apiKey;
    private final int timeoutSeconds;
    private final int maxRetries;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final Sleeper sleeper;
    private final RetryAfterParser retryAfterParser;

    @Autowired
    public OpenAiClient(
            @Value("${llm.base-url:https://api.openai.com/v1}") String baseUrl,
            @Value("${llm.api-key:mock-api-key}") String apiKey,
            @Value("${llm.timeout-seconds:15}") int timeoutSeconds,
            @Value("${llm.max-retries:3}") int maxRetries,
            ObjectMapper objectMapper,
            @Autowired(required = false) Sleeper sleeper
    ) {
        this(baseUrl, apiKey, timeoutSeconds, maxRetries, objectMapper,
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(timeoutSeconds)).build(),
                sleeper != null ? sleeper : Sleeper.DEFAULT,
                new RetryAfterParser());
    }

    public OpenAiClient(
            String baseUrl,
            String apiKey,
            int timeoutSeconds,
            int maxRetries,
            ObjectMapper objectMapper,
            HttpClient httpClient,
            Sleeper sleeper,
            RetryAfterParser retryAfterParser
    ) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.apiKey = apiKey;
        this.timeoutSeconds = timeoutSeconds;
        this.maxRetries = maxRetries;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
        this.sleeper = sleeper;
        this.retryAfterParser = retryAfterParser;
    }

    public OpenAiChatResponse chatCompletion(OpenAiChatRequest request) {
        String endpoint = baseUrl + "/chat/completions";

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                String requestJson = objectMapper.writeValueAsString(request);
                log.debug("Sending OpenAI chat request (attempt {}): {}", attempt, requestJson);

                HttpRequest httpRequest = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .timeout(Duration.ofSeconds(timeoutSeconds))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                        .build();

                HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
                int status = response.statusCode();
                log.debug("OpenAI response status: {}", status);

                if (status == 200) {
                    return objectMapper.readValue(response.body(), OpenAiChatResponse.class);
                }

                if (status == 401) {
                    log.error("OpenAI authentication rejected (401). Invalid or missing API key.");
                    throw new OpenAiAuthException("Upstream LLM provider authentication failed (HTTP 401)");
                }

                if (status == 429) {
                    String retryAfterHeader = response.headers().firstValue("Retry-After").orElse(null);
                    long waitMillis = retryAfterParser.parseToMillis(retryAfterHeader, (long) Math.pow(2, attempt) * 1000L);
                    log.warn("OpenAI rate limit (429). Retry-After: '{}'. Waiting {} ms before attempt {}/{}",
                            retryAfterHeader, waitMillis, attempt + 1, maxRetries);

                    if (attempt < maxRetries) {
                        try {
                            sleeper.sleep(waitMillis);
                            continue;
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            throw new OpenAiServiceException("Interrupted while waiting for rate limit backoff", e);
                        }
                    } else {
                        throw new OpenAiRateLimitException("Upstream LLM provider rate limit exceeded after " + maxRetries + " retries", waitMillis);
                    }
                }

                if (status >= 500) {
                    log.warn("OpenAI server error ({}) on attempt {}/{}", status, attempt + 1, maxRetries);
                    if (attempt < maxRetries) {
                        long backoff = (long) Math.pow(2, attempt) * 500L;
                        try {
                            sleeper.sleep(backoff);
                            continue;
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            throw new OpenAiServiceException("Interrupted during backoff", e);
                        }
                    }
                    throw new OpenAiServiceException("Upstream LLM provider server error: HTTP " + status, status);
                }

                // Any other 4xx error (e.g. 400 Bad Request, 404)
                throw new OpenAiServiceException("Upstream LLM provider client error: HTTP " + status + " - " + response.body(), status);

            } catch (IOException e) {
                log.warn("Network I/O error contacting OpenAI (attempt {}/{}): {}", attempt + 1, maxRetries, e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        sleeper.sleep(500L);
                        continue;
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new OpenAiServiceException("Interrupted during network retry", ie);
                    }
                }
                throw new OpenAiServiceException("Failed to communicate with LLM provider", e);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new OpenAiServiceException("Request to LLM provider was interrupted", e);
            }
        }

        throw new OpenAiServiceException("Exceeded maximum retries for LLM provider", 500);
    }
}
