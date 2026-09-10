package com.example.assistant.tools;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CheckServiceStatusTool implements Tool {

    public static final String NAME = "check_service_status";
    private static final Set<String> ALLOWED_SERVICES = Set.of(
            "billing", "auth", "notifications", "inventory", "search"
    );

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public String getDescription() {
        return "Checks the operational health, response latency, and active incidents of an internal backend service.";
    }

    @Override
    public Map<String, Object> getParameterSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", Map.of(
                "service_name", Map.of(
                        "type", "string",
                        "description", "Target internal service identifier",
                        "enum", List.of("billing", "auth", "notifications", "inventory", "search")
                )
        ));
        schema.put("required", List.of("service_name"));
        schema.put("additionalProperties", false);
        return schema;
    }

    @Override
    public Set<String> getAllowedRoles() {
        return Set.of("ROLE_SUPPORT_AGENT", "ROLE_SUPPORT_TRAINEE");
    }

    @Override
    public ToolResult execute(JsonNode arguments, Authentication authentication) {
        if (arguments == null || !arguments.isObject()) {
            return ToolResult.failed("Arguments must be a valid JSON object");
        }

        // Unknown fields check
        Iterator<String> fieldNames = arguments.fieldNames();
        while (fieldNames.hasNext()) {
            String field = fieldNames.next();
            if (!"service_name".equals(field)) {
                return ToolResult.failed("Unknown argument: '" + field + "'. Only 'service_name' is allowed.");
            }
        }

        JsonNode serviceNode = arguments.get("service_name");
        if (serviceNode == null || !serviceNode.isTextual() || serviceNode.asText().isBlank()) {
            return ToolResult.failed("Field 'service_name' is required and must be a non-empty string");
        }

        String serviceName = serviceNode.asText().trim().toLowerCase();
        if (!ALLOWED_SERVICES.contains(serviceName)) {
            return ToolResult.failed("Unknown service '" + serviceName + "'. Allowed: " + ALLOWED_SERVICES);
        }

        // Mock status response
        String statusJson = switch (serviceName) {
            case "billing" -> """
                    {"service":"billing","status":"DEGRADED","latency_ms":840,"active_incidents":["INC-901: Stripe webhook processing delayed"]}""";
            case "auth" -> """
                    {"service":"auth","status":"HEALTHY","latency_ms":42,"active_incidents":[]}""";
            case "notifications" -> """
                    {"service":"notifications","status":"HEALTHY","latency_ms":65,"active_incidents":[]}""";
            case "inventory" -> """
                    {"service":"inventory","status":"HEALTHY","latency_ms":110,"active_incidents":[]}""";
            case "search" -> """
                    {"service":"search","status":"HEALTHY","latency_ms":55,"active_incidents":[]}""";
            default -> """
                    {"service":"unknown","status":"UNKNOWN","active_incidents":[]}""";
        };

        return ToolResult.ok(statusJson);
    }
}
