package com.example.assistant.client;

/**
 * Thrown when the upstream LLM provider returns a 5xx error or connection fails.
 */
public class OpenAiServiceException extends OpenAiException {
    private final int statusCode;

    public OpenAiServiceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public OpenAiServiceException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
