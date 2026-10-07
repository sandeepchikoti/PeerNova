package com.peernova.dto;

import java.time.LocalDateTime;

public class ChatConversationDTO {

    private Long connectionId;
    private Long peerProfileId;
    private String peerName;
    private String peerCollege;
    private String peerDepartment;
    private String peerVerificationStatus;
    private String lastMessage;
    private LocalDateTime lastMessageTimestamp;
    private long unreadCount;

    public ChatConversationDTO() {
    }

    public ChatConversationDTO(Long connectionId, Long peerProfileId, String peerName, String peerCollege, String peerDepartment, String peerVerificationStatus, String lastMessage, LocalDateTime lastMessageTimestamp, long unreadCount) {
        this.connectionId = connectionId;
        this.peerProfileId = peerProfileId;
        this.peerName = peerName;
        this.peerCollege = peerCollege;
        this.peerDepartment = peerDepartment;
        this.peerVerificationStatus = peerVerificationStatus;
        this.lastMessage = lastMessage;
        this.lastMessageTimestamp = lastMessageTimestamp;
        this.unreadCount = unreadCount;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }

    public Long getPeerProfileId() {
        return peerProfileId;
    }

    public void setPeerProfileId(Long peerProfileId) {
        this.peerProfileId = peerProfileId;
    }

    public String getPeerName() {
        return peerName;
    }

    public void setPeerName(String peerName) {
        this.peerName = peerName;
    }

    public String getPeerCollege() {
        return peerCollege;
    }

    public void setPeerCollege(String peerCollege) {
        this.peerCollege = peerCollege;
    }

    public String getPeerDepartment() {
        return peerDepartment;
    }

    public void setPeerDepartment(String peerDepartment) {
        this.peerDepartment = peerDepartment;
    }

    public String getPeerVerificationStatus() {
        return peerVerificationStatus;
    }

    public void setPeerVerificationStatus(String peerVerificationStatus) {
        this.peerVerificationStatus = peerVerificationStatus;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTimestamp() {
        return lastMessageTimestamp;
    }

    public void setLastMessageTimestamp(LocalDateTime lastMessageTimestamp) {
        this.lastMessageTimestamp = lastMessageTimestamp;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
}
