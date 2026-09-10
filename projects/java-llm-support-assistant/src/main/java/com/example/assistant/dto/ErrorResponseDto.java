package com.example.assistant.dto;

import java.time.Instant;

public record ErrorResponseDto(
        String code,
        String message,
        int status,
        Instant timestamp
) {
    public static ErrorResponseDto of(String code, String message, int status) {
        return new ErrorResponseDto(code, message, status, Instant.now());
    }
}
