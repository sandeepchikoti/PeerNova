package com.peernova.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ChatMessageRequestDTO {

    @NotNull(message = "Connection ID is required")
    private Long connectionId;

    @NotNull(message = "Recipient Profile ID is required")
    private Long recipientProfileId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;

    public ChatMessageRequestDTO() {
    }

    public ChatMessageRequestDTO(Long connectionId, Long recipientProfileId, String content) {
        this.connectionId = connectionId;
        this.recipientProfileId = recipientProfileId;
        this.content = content;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }

    public Long getRecipientProfileId() {
        return recipientProfileId;
    }

    public void setRecipientProfileId(Long recipientProfileId) {
        this.recipientProfileId = recipientProfileId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
