package com.example.assistant.tools;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.Set;

public interface Tool {
    String getName();
    String getDescription();
    Map<String, Object> getParameterSchema();
    Set<String> getAllowedRoles();
    ToolResult execute(JsonNode arguments, Authentication authentication);
}
