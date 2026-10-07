package com.peernova.dto;

import com.peernova.entity.ConnectionStatus;
import java.time.LocalDateTime;

public class ConnectionResponseDTO {
    private Long id;
    private Long senderProfileId;
    private String senderName;
    private String senderEmail;
    private String senderCollege;
    private String senderDepartment;

    private Long receiverProfileId;
    private String receiverName;
    private String receiverEmail;
    private String receiverCollege;
    private String receiverDepartment;

    private ConnectionStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ConnectionResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderProfileId() {
        return senderProfileId;
    }

    public void setSenderProfileId(Long senderProfileId) {
        this.senderProfileId = senderProfileId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderCollege() {
        return senderCollege;
    }

    public void setSenderCollege(String senderCollege) {
        this.senderCollege = senderCollege;
    }

    public String getSenderDepartment() {
        return senderDepartment;
    }

    public void setSenderDepartment(String senderDepartment) {
        this.senderDepartment = senderDepartment;
    }

    public Long getReceiverProfileId() {
        return receiverProfileId;
    }

    public void setReceiverProfileId(Long receiverProfileId) {
        this.receiverProfileId = receiverProfileId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getReceiverCollege() {
        return receiverCollege;
    }

    public void setReceiverCollege(String receiverCollege) {
        this.receiverCollege = receiverCollege;
    }

    public String getReceiverDepartment() {
        return receiverDepartment;
    }

    public void setReceiverDepartment(String receiverDepartment) {
        this.receiverDepartment = receiverDepartment;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
