package com.example.assistant.client;

/**
 * Thrown when the upstream LLM provider rejects authentication (HTTP 401).
 * Mapped to HTTP 502 Bad Gateway with code PROVIDER_AUTH_ERROR by GlobalExceptionHandler
 * to prevent leaking internal provider credentials or confusing upstream auth with client auth.
 */
public class OpenAiAuthException extends OpenAiException {
    public OpenAiAuthException(String message) {
        super(message);
    }
}
