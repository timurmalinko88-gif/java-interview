package com.example.assistant.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ToolCallDto(
        @JsonProperty("id") String id,
        @JsonProperty("type") String type,
        @JsonProperty("function") FunctionCallDto function
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FunctionCallDto(
            @JsonProperty("name") String name,
            @JsonProperty("arguments") String arguments
    ) {}
}
