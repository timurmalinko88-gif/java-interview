package com.example.assistant.client;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class RetryAfterParser {

    private final Clock clock;

    public RetryAfterParser() {
        this(Clock.systemUTC());
    }

    public RetryAfterParser(Clock clock) {
        this.clock = clock;
    }

    public long parseToMillis(String headerValue, long defaultMillis) {
        if (headerValue == null || headerValue.isBlank()) {
            return defaultMillis;
        }
        String trimmed = headerValue.trim();

        // 1. Check if integer seconds
        try {
            long seconds = Long.parseLong(trimmed);
            return Math.max(0, seconds * 1000L);
        } catch (NumberFormatException ignored) {
            // Not seconds, try RFC 1123 date
        }

        // 2. Check if RFC 1123 HTTP-date (e.g. "Wed, 21 Oct 2026 07:28:00 GMT")
        try {
            Instant targetTime = Instant.from(DateTimeFormatter.RFC_1123_DATE_TIME.parse(trimmed));
            Instant now = clock.instant();
            long millis = Duration.between(now, targetTime).toMillis();
            return Math.max(0, millis);
        } catch (DateTimeParseException ignored) {
            // Invalid format
        }

        return defaultMillis;
    }
}
