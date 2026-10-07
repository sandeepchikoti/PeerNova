package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "connection_id", nullable = false)
    private Connection connection;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_profile_id", nullable = false)
    private StudentProfile sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_profile_id", nullable = false)
    private StudentProfile recipient;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public ChatMessage() {
    }

    public ChatMessage(Connection connection, StudentProfile sender, StudentProfile recipient, String content) {
        this.connection = connection;
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.isRead = false;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Connection getConnection() {
        return connection;
    }

    public void setConnection(Connection connection) {
        this.connection = connection;
    }

    public StudentProfile getSender() {
        return sender;
    }

    public void setSender(StudentProfile sender) {
        this.sender = sender;
    }

    public StudentProfile getRecipient() {
        return recipient;
    }

    public void setRecipient(StudentProfile recipient) {
        this.recipient = recipient;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
