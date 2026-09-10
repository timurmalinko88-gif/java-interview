package com.example.assistant.dto;

import java.util.List;

public record ChatResponse(
        String reply,
        List<ToolExecutionSummary> toolCallsExecuted,
        UsageDto usage,
        int iterations,
        String conversationId
) {
    public record ToolExecutionSummary(
            String toolName,
            String arguments,
            String status,
            String result
    ) {}
}
