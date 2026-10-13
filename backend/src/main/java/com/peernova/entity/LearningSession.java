package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_sessions")
public class LearningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_profile_id", nullable = false)
    private StudentProfile mentor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learner_profile_id", nullable = false)
    private StudentProfile learner;

    @Column(name = "skill_topic", nullable = false)
    private String skillTopic;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.REQUESTED;

    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "meeting_room_id")
    private String meetingRoomId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LearningSession() {
    }

    public LearningSession(StudentProfile mentor, StudentProfile learner, String skillTopic,
                           LocalDateTime scheduledAt, Integer durationMinutes, String description,
                           String meetingRoomId, String meetingUrl) {
        this.mentor = mentor;
        this.learner = learner;
        this.skillTopic = skillTopic;
        this.scheduledAt = scheduledAt;
        this.durationMinutes = (durationMinutes != null && durationMinutes > 0) ? durationMinutes : 45;
        this.description = description;
        this.meetingRoomId = meetingRoomId;
        this.meetingUrl = meetingUrl;
        this.status = SessionStatus.REQUESTED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentProfile getMentor() {
        return mentor;
    }

    public void setMentor(StudentProfile mentor) {
        this.mentor = mentor;
    }

    public StudentProfile getLearner() {
        return learner;
    }

    public void setLearner(StudentProfile learner) {
        this.learner = learner;
    }

    public String getSkillTopic() {
        return skillTopic;
    }

    public void setSkillTopic(String skillTopic) {
        this.skillTopic = skillTopic;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public String getMeetingRoomId() {
        return meetingRoomId;
    }

    public void setMeetingRoomId(String meetingRoomId) {
        this.meetingRoomId = meetingRoomId;
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
