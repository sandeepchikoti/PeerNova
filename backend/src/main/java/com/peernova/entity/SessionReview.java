package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_reviews")
public class SessionReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private LearningSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_profile_id", nullable = false)
    private StudentProfile reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_profile_id", nullable = false)
    private StudentProfile reviewee;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(name = "communication_rating")
    private Integer communicationRating; // 1 to 5

    @Column(name = "knowledge_rating")
    private Integer knowledgeRating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_flagged", nullable = false)
    private boolean isFlagged = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SessionReview() {
    }

    public SessionReview(LearningSession session, StudentProfile reviewer, StudentProfile reviewee,
                         Integer rating, Integer communicationRating, Integer knowledgeRating, String comment) {
        this.session = session;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.rating = rating;
        this.communicationRating = communicationRating;
        this.knowledgeRating = knowledgeRating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
        this.isFlagged = false;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LearningSession getSession() {
        return session;
    }

    public void setSession(LearningSession session) {
        this.session = session;
    }

    public StudentProfile getReviewer() {
        return reviewer;
    }

    public void setReviewer(StudentProfile reviewer) {
        this.reviewer = reviewer;
    }

    public StudentProfile getReviewee() {
        return reviewee;
    }

    public void setReviewee(StudentProfile reviewee) {
        this.reviewee = reviewee;
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

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
