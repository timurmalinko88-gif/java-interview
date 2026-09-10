package com.example.assistant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record ToolDefinitionDto(
        @JsonProperty("type") String type,
        @JsonProperty("function") FunctionDefinitionDto function
) {
    public static ToolDefinitionDto function(String name, String description, Map<String, Object> parameters) {
        return new ToolDefinitionDto("function", new FunctionDefinitionDto(name, description, parameters));
    }

    public record FunctionDefinitionDto(
            @JsonProperty("name") String name,
            @JsonProperty("description") String description,
            @JsonProperty("parameters") Map<String, Object> parameters
    ) {}
}
