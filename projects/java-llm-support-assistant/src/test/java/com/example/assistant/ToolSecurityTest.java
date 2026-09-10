package com.example.assistant;

import com.example.assistant.client.RetryAfterParser;
import com.example.assistant.tools.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ToolSecurityTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private CheckServiceStatusTool statusTool;
    private ManageTicketTool ticketTool;
    private SearchHelpArticlesTool searchTool;

    private Authentication aliceAuth; // ROLE_SUPPORT_AGENT
    private Authentication bobAuth;   // ROLE_SUPPORT_TRAINEE

    @BeforeEach
    void setUp() {
        statusTool = new CheckServiceStatusTool();
        ticketTool = new ManageTicketTool();
        searchTool = new SearchHelpArticlesTool();

        aliceAuth = new UsernamePasswordAuthenticationToken(
                "alice",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_SUPPORT_AGENT"))
        );

        bobAuth = new UsernamePasswordAuthenticationToken(
                "bob",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_SUPPORT_TRAINEE"))
        );
    }

    @Test
    @DisplayName("Alice (ROLE_SUPPORT_AGENT) can successfully execute manage_ticket")
    void aliceCanManageTicket() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("title", "Stripe webhook failure");
        args.put("priority", "HIGH");
        args.put("service", "billing");
        args.put("description", "Customer subscriptions are not renewing properly.");

        ToolResult result = ticketTool.execute(args, aliceAuth);
        assertTrue(result.success());
        assertNull(result.error());
        assertTrue(result.data().contains("TCK-"));
        assertTrue(result.data().contains("assigned_by\":\"alice"));
    }

    @Test
    @DisplayName("Bob (ROLE_SUPPORT_TRAINEE) is rejected with ACCESS_DENIED from manage_ticket")
    void bobCannotManageTicket() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("title", "Escalate DB timeout");
        args.put("priority", "CRITICAL");
        args.put("service", "auth");
        args.put("description", "High authentication latency on primary cluster.");

        ToolResult result = ticketTool.execute(args, bobAuth);
        assertFalse(result.success());
        assertNotNull(result.error());
        assertTrue(result.error().startsWith("ACCESS_DENIED"));
        assertTrue(result.error().contains("ROLE_SUPPORT_AGENT"));
    }

    @Test
    @DisplayName("manage_ticket rejects invalid title bounds (< 5 chars or > 100 chars)")
    void manageTicketValidatesTitleLength() {
        ObjectNode tooShort = objectMapper.createObjectNode();
        tooShort.put("title", "Bug"); // < 5 chars
        tooShort.put("priority", "LOW");
        tooShort.put("service", "search");
        tooShort.put("description", "Search index is returning stale items.");

        ToolResult shortResult = ticketTool.execute(tooShort, aliceAuth);
        assertFalse(shortResult.success());
        assertTrue(shortResult.error().contains("title"));

        ObjectNode tooLong = objectMapper.createObjectNode();
        tooLong.put("title", "A".repeat(101));
        tooLong.put("priority", "LOW");
        tooLong.put("service", "search");
        tooLong.put("description", "Search index is returning stale items.");

        ToolResult longResult = ticketTool.execute(tooLong, aliceAuth);
        assertFalse(longResult.success());
        assertTrue(longResult.error().contains("title"));
    }

    @Test
    @DisplayName("manage_ticket rejects invalid priority outside allowed enum")
    void manageTicketValidatesPriorityEnum() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("title", "Valid ticket title");
        args.put("priority", "SUPER_URGENT"); // Invalid enum
        args.put("service", "search");
        args.put("description", "Search index is returning stale items.");

        ToolResult result = ticketTool.execute(args, aliceAuth);
        assertFalse(result.success());
        assertTrue(result.error().contains("Invalid priority"));
    }

    @Test
    @DisplayName("manage_ticket rejects unknown unexpected fields")
    void manageTicketRejectsUnknownFields() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("title", "Valid ticket title");
        args.put("priority", "LOW");
        args.put("service", "search");
        args.put("description", "Search index is returning stale items.");
        args.put("hacker_payload", "drop tables"); // unknown field

        ToolResult result = ticketTool.execute(args, aliceAuth);
        assertFalse(result.success());
        assertTrue(result.error().contains("Unknown argument"));
    }

    @Test
    @DisplayName("check_service_status is accessible by both Alice and Bob, validates service allowlist")
    void checkServiceStatusValidation() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("service_name", "billing");

        // Alice executes
        ToolResult aliceResult = statusTool.execute(args, aliceAuth);
        assertTrue(aliceResult.success());
        assertTrue(aliceResult.data().contains("DEGRADED"));

        // Bob executes
        ToolResult bobResult = statusTool.execute(args, bobAuth);
        assertTrue(bobResult.success());
        assertTrue(bobResult.data().contains("DEGRADED"));

        // Unknown service
        ObjectNode unknownArgs = objectMapper.createObjectNode();
        unknownArgs.put("service_name", "crypto-miner");
        ToolResult invalidService = statusTool.execute(unknownArgs, aliceAuth);
        assertFalse(invalidService.success());
        assertTrue(invalidService.error().contains("Unknown service"));
    }

    @Test
    @DisplayName("search_help_articles validates query bounds and limit bounds")
    void searchHelpArticlesValidation() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("query", "stripe");
        args.put("limit", 2);

        ToolResult result = searchTool.execute(args, bobAuth);
        assertTrue(result.success());
        assertTrue(result.data().contains("KB-1042"));

        // Query too short (< 3 chars)
        ObjectNode shortQuery = objectMapper.createObjectNode();
        shortQuery.put("query", "ab");
        ToolResult shortRes = searchTool.execute(shortQuery, bobAuth);
        assertFalse(shortRes.success());
        assertTrue(shortRes.error().contains("query"));

        // Limit out of bounds (> 5)
        ObjectNode badLimit = objectMapper.createObjectNode();
        badLimit.put("query", "billing");
        badLimit.put("limit", 10);
        ToolResult limitRes = searchTool.execute(badLimit, bobAuth);
        assertFalse(limitRes.success());
        assertTrue(limitRes.error().contains("limit"));
    }

    @Test
    @DisplayName("RetryAfterParser parses integer seconds and RFC 1123 HTTP-Date")
    void retryAfterParserTests() {
        Instant fixedNow = Instant.parse("2026-03-01T12:00:00Z");
        Clock fixedClock = Clock.fixed(fixedNow, ZoneOffset.UTC);
        RetryAfterParser parser = new RetryAfterParser(fixedClock);

        // 1. Seconds
        assertEquals(5000L, parser.parseToMillis("5", 1000L));
        assertEquals(120000L, parser.parseToMillis("120", 1000L));

        // 2. RFC 1123 HTTP-date: exactly 30 seconds after fixedNow
        // "Sun, 01 Mar 2026 12:00:30 GMT"
        String rfc1123Date = "Sun, 01 Mar 2026 12:00:30 GMT";
        assertEquals(30000L, parser.parseToMillis(rfc1123Date, 1000L));

        // 3. Fallback on invalid format
        assertEquals(2500L, parser.parseToMillis("not-a-valid-date", 2500L));
    }
}
