package com.example.assistant.tools;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ManageTicketTool implements Tool {

    public static final String NAME = "manage_ticket";
    private static final Set<String> ALLOWED_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH", "CRITICAL");
    private static final Set<String> ALLOWED_KEYS = Set.of("title", "priority", "service", "description");

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public String getDescription() {
        return "Creates or escalates an internal support ticket. Requires ROLE_SUPPORT_AGENT authority.";
    }

    @Override
    public Map<String, Object> getParameterSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", Map.of(
                "title", Map.of("type", "string", "description", "Short summary (5 to 100 characters)"),
                "priority", Map.of("type", "string", "description", "Priority level", "enum", List.of("LOW", "MEDIUM", "HIGH", "CRITICAL")),
                "service", Map.of("type", "string", "description", "Affected service identifier"),
                "description", Map.of("type", "string", "description", "Detailed description of the issue (10 to 500 characters)")
        ));
        schema.put("required", List.of("title", "priority", "service", "description"));
        schema.put("additionalProperties", false);
        return schema;
    }

    @Override
    public Set<String> getAllowedRoles() {
        return Set.of("ROLE_SUPPORT_AGENT");
    }

    @Override
    public ToolResult execute(JsonNode arguments, Authentication authentication) {
        // 1. Server-side RBAC validation: identity is ALWAYS derived from SecurityContext, NEVER from arguments
        if (authentication == null) {
            return ToolResult.denied("Unauthenticated call. Security context is empty.");
        }

        boolean hasAgentRole = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_SUPPORT_AGENT"::equals);

        if (!hasAgentRole) {
            return ToolResult.denied("User '" + authentication.getName() + "' is not authorized to execute '" + NAME + "'. Required authority: ROLE_SUPPORT_AGENT");
        }

        // 2. Schema and type validation
        if (arguments == null || !arguments.isObject()) {
            return ToolResult.failed("Arguments must be a valid JSON object");
        }

        // Reject unknown properties
        Iterator<String> fieldNames = arguments.fieldNames();
        while (fieldNames.hasNext()) {
            String key = fieldNames.next();
            if (!ALLOWED_KEYS.contains(key)) {
                return ToolResult.failed("Unknown argument: '" + key + "'. Allowed: " + ALLOWED_KEYS);
            }
        }

        // Required field: title
        JsonNode titleNode = arguments.get("title");
        if (titleNode == null || !titleNode.isTextual()) {
            return ToolResult.failed("Field 'title' is required and must be a string");
        }
        String title = titleNode.asText().trim();
        if (title.length() < 5 || title.length() > 100) {
            return ToolResult.failed("Field 'title' length must be between 5 and 100 characters. Got: " + title.length());
        }

        // Required field: priority
        JsonNode priorityNode = arguments.get("priority");
        if (priorityNode == null || !priorityNode.isTextual()) {
            return ToolResult.failed("Field 'priority' is required and must be a string");
        }
        String priority = priorityNode.asText().trim().toUpperCase();
        if (!ALLOWED_PRIORITIES.contains(priority)) {
            return ToolResult.failed("Invalid priority '" + priority + "'. Allowed: " + ALLOWED_PRIORITIES);
        }

        // Required field: service
        JsonNode serviceNode = arguments.get("service");
        if (serviceNode == null || !serviceNode.isTextual() || serviceNode.asText().isBlank()) {
            return ToolResult.failed("Field 'service' is required and must be a non-empty string");
        }
        String service = serviceNode.asText().trim();

        // Required field: description
        JsonNode descNode = arguments.get("description");
        if (descNode == null || !descNode.isTextual()) {
            return ToolResult.failed("Field 'description' is required and must be a string");
        }
        String description = descNode.asText().trim();
        if (description.length() < 10 || description.length() > 500) {
            return ToolResult.failed("Field 'description' length must be between 10 and 500 characters. Got: " + description.length());
        }

        // Execution success
        String ticketId = "TCK-" + Math.abs((title + service + System.currentTimeMillis()).hashCode() % 90000 + 10000);
        String resultJson = String.format(
                "{\"ticket_id\":\"%s\",\"status\":\"CREATED\",\"assigned_by\":\"%s\",\"service\":\"%s\",\"priority\":\"%s\",\"title\":\"%s\"}",
                ticketId, authentication.getName(), service, priority, title.replace("\"", "\\\"")
        );

        return ToolResult.ok(resultJson);
    }
}
