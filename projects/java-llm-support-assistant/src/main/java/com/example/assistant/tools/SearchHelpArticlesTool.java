package com.example.assistant.tools;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SearchHelpArticlesTool implements Tool {

    public static final String NAME = "search_help_articles";
    private static final Set<String> ALLOWED_KEYS = Set.of("query", "limit");

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public String getDescription() {
        return "Searches internal troubleshooting knowledge base articles by keywords.";
    }

    @Override
    public Map<String, Object> getParameterSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", Map.of(
                "query", Map.of("type", "string", "description", "Keywords to search for (3 to 80 characters)"),
                "limit", Map.of("type", "integer", "description", "Max articles to return (1 to 5)", "minimum", 1, "maximum", 5)
        ));
        schema.put("required", List.of("query"));
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
            String key = fieldNames.next();
            if (!ALLOWED_KEYS.contains(key)) {
                return ToolResult.failed("Unknown argument: '" + key + "'. Allowed: " + ALLOWED_KEYS);
            }
        }

        JsonNode queryNode = arguments.get("query");
        if (queryNode == null || !queryNode.isTextual()) {
            return ToolResult.failed("Field 'query' is required and must be a string");
        }
        String query = queryNode.asText().trim();
        if (query.length() < 3 || query.length() > 80) {
            return ToolResult.failed("Field 'query' length must be between 3 and 80 characters. Got: " + query.length());
        }

        int limit = 3;
        if (arguments.has("limit")) {
            JsonNode limitNode = arguments.get("limit");
            if (!limitNode.isIntegralNumber()) {
                return ToolResult.failed("Field 'limit' must be an integer");
            }
            limit = limitNode.asInt();
            if (limit < 1 || limit > 5) {
                return ToolResult.failed("Field 'limit' must be between 1 and 5. Got: " + limit);
            }
        }

        String resultJson = String.format("""
                {"query":"%s","count":1,"articles":[{"id":"KB-1042","title":"Troubleshooting Stripe Webhook Delays","snippet":"Verify Kafka consumer lag and dead-letter queue when billing webhooks are slow."}]}""",
                query.replace("\"", "\\\""));

        return ToolResult.ok(resultJson);
    }
}
