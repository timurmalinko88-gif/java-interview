package com.example.assistant.controller;

import com.example.assistant.client.OpenAiAuthException;
import com.example.assistant.client.OpenAiRateLimitException;
import com.example.assistant.client.OpenAiServiceException;
import com.example.assistant.dto.ErrorResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Provider 401 is mapped to 502 Bad Gateway to prevent exposing upstream auth credentials
     * and distinguishing internal client auth failures from upstream provider failures.
     */
    @ExceptionHandler(OpenAiAuthException.class)
    public ResponseEntity<ErrorResponseDto> handleOpenAiAuth(OpenAiAuthException ex) {
        log.error("Upstream provider authentication error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ErrorResponseDto.of(
                        "PROVIDER_AUTH_ERROR",
                        "Upstream LLM provider authentication failed. Check server configuration.",
                        HttpStatus.BAD_GATEWAY.value()
                ));
    }

    @ExceptionHandler(OpenAiRateLimitException.class)
    public ResponseEntity<ErrorResponseDto> handleOpenAiRateLimit(OpenAiRateLimitException ex) {
        log.warn("Upstream provider rate limit: {}", ex.getMessage());
        long retryAfterSec = Math.max(1, ex.getRetryAfterMillis() / 1000L);
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSec))
                .body(ErrorResponseDto.of(
                        "PROVIDER_RATE_LIMIT",
                        ex.getMessage(),
                        HttpStatus.TOO_MANY_REQUESTS.value()
                ));
    }

    @ExceptionHandler(OpenAiServiceException.class)
    public ResponseEntity<ErrorResponseDto> handleOpenAiService(OpenAiServiceException ex) {
        log.error("Upstream provider service error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ErrorResponseDto.of(
                        "PROVIDER_SERVICE_ERROR",
                        "Upstream LLM provider encountered an error",
                        HttpStatus.BAD_GATEWAY.value()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getAllErrors().isEmpty()
                ? "Validation error"
                : ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponseDto.of("VALIDATION_ERROR", msg, HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponseDto.of("ACCESS_DENIED", "Access is denied", HttpStatus.FORBIDDEN.value()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneric(Exception ex) {
        log.error("Unhandled server error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponseDto.of("INTERNAL_SERVER_ERROR", "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
