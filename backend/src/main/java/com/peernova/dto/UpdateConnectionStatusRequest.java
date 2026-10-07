package com.peernova.dto;

import com.peernova.entity.ConnectionStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateConnectionStatusRequest {

    @NotNull(message = "Connection status (ACCEPTED/REJECTED) is required")
    private ConnectionStatus status;

    public UpdateConnectionStatusRequest() {
    }

    public UpdateConnectionStatusRequest(ConnectionStatus status) {
        this.status = status;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }
}
