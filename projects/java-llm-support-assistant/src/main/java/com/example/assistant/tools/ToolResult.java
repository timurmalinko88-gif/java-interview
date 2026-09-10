package com.example.assistant.tools;

public record ToolResult(
        boolean success,
        String data,
        String error
) {
    public static ToolResult ok(String data) {
        return new ToolResult(true, data, null);
    }

    public static ToolResult failed(String error) {
        return new ToolResult(false, null, error);
    }

    public static ToolResult denied(String message) {
        return new ToolResult(false, null, "ACCESS_DENIED: " + message);
    }
}
