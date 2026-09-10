package com.example.assistant.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatMessageDto(
        @JsonProperty("role") String role,
        @JsonProperty("content") String content,
        @JsonProperty("name") String name,
        @JsonProperty("tool_call_id") String toolCallId,
        @JsonProperty("tool_calls") List<ToolCallDto> toolCalls
) {
    public static ChatMessageDto system(String content) {
        return new ChatMessageDto("system", content, null, null, null);
    }

    public static ChatMessageDto user(String content) {
        return new ChatMessageDto("user", content, null, null, null);
    }

    public static ChatMessageDto assistant(String content) {
        return new ChatMessageDto("assistant", content, null, null, null);
    }

    public static ChatMessageDto assistantWithToolCalls(String content, List<ToolCallDto> toolCalls) {
        return new ChatMessageDto("assistant", content, null, null, toolCalls);
    }

    public static ChatMessageDto tool(String toolCallId, String name, String content) {
        return new ChatMessageDto("tool", content, name, toolCallId, null);
    }
}
