package com.example.assistant.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenAiChatResponse(
        @JsonProperty("id") String id,
        @JsonProperty("model") String model,
        @JsonProperty("choices") List<ChoiceDto> choices,
        @JsonProperty("usage") UsageDto usage
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ChoiceDto(
            @JsonProperty("index") int index,
            @JsonProperty("message") ChatMessageDto message,
            @JsonProperty("finish_reason") String finishReason
    ) {}

    public ChatMessageDto getFirstMessage() {
        if (choices == null || choices.isEmpty()) {
            return null;
        }
        return choices.get(0).message();
    }
}
