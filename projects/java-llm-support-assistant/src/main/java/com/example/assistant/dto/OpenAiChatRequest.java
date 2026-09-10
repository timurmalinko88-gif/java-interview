package com.example.assistant.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OpenAiChatRequest(
        @JsonProperty("model") String model,
        @JsonProperty("messages") List<ChatMessageDto> messages,
        @JsonProperty("tools") List<ToolDefinitionDto> tools,
        @JsonProperty("tool_choice") Object toolChoice,
        @JsonProperty("temperature") Double temperature
) {}
