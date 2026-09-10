package com.example.assistant.service;

import com.example.assistant.client.OpenAiClient;
import com.example.assistant.dto.*;
import com.example.assistant.tools.ToolResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AssistantService {

    private static final Logger log = LoggerFactory.getLogger(AssistantService.class);

    private static final String SYSTEM_PROMPT = """
            You are an AI Support Assistant for internal engineering and customer operations.
            You have access to internal tools for inspecting services, knowledge base search, and ticket management.
            Always use tools when specific operational details or actions are requested.
            When a tool returns ACCESS_DENIED or an error, politely inform the user about the exact permission or error cause.
            Never invent ticket IDs or service health metrics without querying the relevant tool.
            """;

    private final OpenAiClient openAiClient;
    private final ToolRegistry toolRegistry;
    private final String model;
    private final int maxIterations;

    public AssistantService(
            OpenAiClient openAiClient,
            ToolRegistry toolRegistry,
            @Value("${llm.model:gpt-4o-mini}") String model,
            @Value("${llm.max-loop-iterations:5}") int maxIterations
    ) {
        this.openAiClient = openAiClient;
        this.toolRegistry = toolRegistry;
        this.model = model;
        this.maxIterations = maxIterations;
    }

    public ChatResponse processUserMessage(ChatRequest request, Authentication authentication) {
        List<ChatMessageDto> messages = new ArrayList<>();
        messages.add(ChatMessageDto.system(SYSTEM_PROMPT));
        messages.add(ChatMessageDto.user(request.message()));

        List<ChatResponse.ToolExecutionSummary> executedTools = new ArrayList<>();
        UsageDto totalUsage = UsageDto.empty();

        for (int iteration = 1; iteration <= maxIterations; iteration++) {
            log.info("Agent iteration {}/{} for user '{}'", iteration, maxIterations, authentication.getName());

            OpenAiChatRequest openAiRequest = new OpenAiChatRequest(
                    model,
                    messages,
                    toolRegistry.getAllToolDefinitions(),
                    "auto",
                    0.1
            );

            OpenAiChatResponse openAiResponse = openAiClient.chatCompletion(openAiRequest);
            totalUsage = totalUsage.add(openAiResponse.usage());

            ChatMessageDto assistantMsg = openAiResponse.getFirstMessage();
            if (assistantMsg == null) {
                log.warn("Received empty choices from LLM provider on iteration {}", iteration);
                return new ChatResponse("Empty response received from LLM provider.", executedTools, totalUsage, iteration, request.conversationId());
            }

            // Append assistant response to dialogue history
            messages.add(assistantMsg);

            // If assistant did not call any tools, we have a final text answer
            if (assistantMsg.toolCalls() == null || assistantMsg.toolCalls().isEmpty()) {
                log.info("LLM concluded dialogue on iteration {} with text reply", iteration);
                return new ChatResponse(assistantMsg.content(), executedTools, totalUsage, iteration, request.conversationId());
            }

            // Process tool calls requested by the model
            for (ToolCallDto toolCall : assistantMsg.toolCalls()) {
                String toolName = toolCall.function().name();
                String args = toolCall.function().arguments();
                log.info("Executing tool '{}' with arguments: {}", toolName, args);

                ToolResult result = toolRegistry.executeTool(toolName, args, authentication);

                String content;
                String status;
                if (result.success()) {
                    content = result.data();
                    status = "SUCCESS";
                } else {
                    content = "{\"error\":\"" + (result.error() != null ? result.error().replace("\"", "\\\"") : "Execution failed") + "\"}";
                    status = "FAILED";
                }

                executedTools.add(new ChatResponse.ToolExecutionSummary(toolName, args, status, content));
                messages.add(ChatMessageDto.tool(toolCall.id(), toolName, content));
            }
        }

        // Safeguard: iteration budget reached
        log.warn("Exceeded maximum agent loop budget ({} iterations)", maxIterations);
        return new ChatResponse(
                "Operational step limit reached (" + maxIterations + " iterations). Partial actions were completed.",
                executedTools,
                totalUsage,
                maxIterations,
                request.conversationId()
        );
    }
}
