package com.example.assistant.service;

import com.example.assistant.dto.ToolDefinitionDto;
import com.example.assistant.tools.Tool;
import com.example.assistant.tools.ToolResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ToolRegistry {

    private static final Logger log = LoggerFactory.getLogger(ToolRegistry.class);

    private final Map<String, Tool> toolMap;
    private final ObjectMapper objectMapper;

    public ToolRegistry(List<Tool> tools, ObjectMapper objectMapper) {
        this.toolMap = tools.stream().collect(Collectors.toMap(Tool::getName, t -> t));
        this.objectMapper = objectMapper;
        log.info("Registered {} tools: {}", toolMap.size(), toolMap.keySet());
    }

    public List<ToolDefinitionDto> getAllToolDefinitions() {
        return toolMap.values().stream()
                .map(tool -> ToolDefinitionDto.function(tool.getName(), tool.getDescription(), tool.getParameterSchema()))
                .toList();
    }

    public boolean hasTool(String name) {
        return toolMap.containsKey(name);
    }

    public ToolResult executeTool(String toolName, String argumentsJson, Authentication authentication) {
        Tool tool = toolMap.get(toolName);
        if (tool == null) {
            log.warn("Attempt to execute unknown tool: '{}'", toolName);
            return ToolResult.failed("Unknown tool '" + toolName + "'. Allowed tools: " + toolMap.keySet());
        }

        JsonNode arguments;
        try {
            if (argumentsJson == null || argumentsJson.isBlank()) {
                arguments = objectMapper.createObjectNode();
            } else {
                arguments = objectMapper.readTree(argumentsJson);
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse tool arguments JSON for '{}': {}", toolName, e.getMessage());
            return ToolResult.failed("Invalid JSON arguments: " + e.getMessage());
        }

        try {
            return tool.execute(arguments, authentication);
        } catch (Exception e) {
            log.error("Unhandled exception executing tool '{}': {}", toolName, e.getMessage(), e);
            return ToolResult.failed("Tool execution error: " + e.getMessage());
        }
    }
}
