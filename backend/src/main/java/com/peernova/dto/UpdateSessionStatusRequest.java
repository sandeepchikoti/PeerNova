package com.peernova.dto;

import com.peernova.entity.SessionStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateSessionStatusRequest {

    @NotNull(message = "Session status is required")
    private SessionStatus status;

    public UpdateSessionStatusRequest() {
    }

    public UpdateSessionStatusRequest(SessionStatus status) {
        this.status = status;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }
}
