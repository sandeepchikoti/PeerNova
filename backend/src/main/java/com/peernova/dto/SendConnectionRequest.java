package com.peernova.dto;

import jakarta.validation.constraints.NotNull;

public class SendConnectionRequest {

    @NotNull(message = "Receiver profile ID is required")
    private Long receiverProfileId;

    private String message;

    public SendConnectionRequest() {
    }

    public SendConnectionRequest(Long receiverProfileId, String message) {
        this.receiverProfileId = receiverProfileId;
        this.message = message;
    }

    public Long getReceiverProfileId() {
        return receiverProfileId;
    }

    public void setReceiverProfileId(Long receiverProfileId) {
        this.receiverProfileId = receiverProfileId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
