package com.example.assistant.client;

/**
 * Thrown when the upstream LLM provider returns HTTP 429 Too Many Requests
 * and automatic retries have been exhausted.
 */
public class OpenAiRateLimitException extends OpenAiException {
    private final long retryAfterMillis;

    public OpenAiRateLimitException(String message, long retryAfterMillis) {
        super(message);
        this.retryAfterMillis = retryAfterMillis;
    }

    public long getRetryAfterMillis() {
        return retryAfterMillis;
    }
}
