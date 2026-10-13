package com.peernova.dto;

import com.peernova.entity.AttendanceStatus;

public class MarkAttendanceRequest {

    private AttendanceStatus status = AttendanceStatus.PRESENT;
    private String remarks;

    public MarkAttendanceRequest() {
    }

    public MarkAttendanceRequest(AttendanceStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
