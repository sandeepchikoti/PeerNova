package com.peernova.dto;

import com.peernova.entity.SessionReview;
import java.time.LocalDateTime;

public class SessionReviewDTO {

    private Long id;
    private Long sessionId;
    private String sessionTopic;
    private Long reviewerProfileId;
    private String reviewerName;
    private Long revieweeProfileId;
    private String revieweeName;
    private Integer rating;
    private Integer communicationRating;
    private Integer knowledgeRating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean isFlagged;

    public SessionReviewDTO() {
    }

    public static SessionReviewDTO fromEntity(SessionReview r) {
        SessionReviewDTO dto = new SessionReviewDTO();
        dto.setId(r.getId());
        if (r.getSession() != null) {
            dto.setSessionId(r.getSession().getId());
            dto.setSessionTopic(r.getSession().getSkillTopic());
        }
        if (r.getReviewer() != null) {
            dto.setReviewerProfileId(r.getReviewer().getId());
            if (r.getReviewer().getUser() != null) {
                dto.setReviewerName(r.getReviewer().getUser().getFullName());
            }
        }
        if (r.getReviewee() != null) {
            dto.setRevieweeProfileId(r.getReviewee().getId());
            if (r.getReviewee().getUser() != null) {
                dto.setRevieweeName(r.getReviewee().getUser().getFullName());
            }
        }
        dto.setRating(r.getRating());
        dto.setCommunicationRating(r.getCommunicationRating());
        dto.setKnowledgeRating(r.getKnowledgeRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setFlagged(r.isFlagged());
        return dto;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionTopic() {
        return sessionTopic;
    }

    public void setSessionTopic(String sessionTopic) {
        this.sessionTopic = sessionTopic;
    }

    public Long getReviewerProfileId() {
        return reviewerProfileId;
    }

    public void setReviewerProfileId(Long reviewerProfileId) {
        this.reviewerProfileId = reviewerProfileId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public Long getRevieweeProfileId() {
        return revieweeProfileId;
    }

    public void setRevieweeProfileId(Long revieweeProfileId) {
        this.revieweeProfileId = revieweeProfileId;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getCommunicationRating() {
        return communicationRating;
    }

    public void setCommunicationRating(Integer communicationRating) {
        this.communicationRating = communicationRating;
    }

    public Integer getKnowledgeRating() {
        return knowledgeRating;
    }

    public void setKnowledgeRating(Integer knowledgeRating) {
        this.knowledgeRating = knowledgeRating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }
}
