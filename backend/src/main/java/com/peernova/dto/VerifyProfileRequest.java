package com.peernova.dto;

import com.peernova.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public class VerifyProfileRequest {

    @NotNull(message = "Verification status is required")
    private VerificationStatus status;

    private String remark;

    public VerifyProfileRequest() {
    }

    public VerifyProfileRequest(VerificationStatus status, String remark) {
        this.status = status;
        this.remark = remark;
    }

    public VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationStatus status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
