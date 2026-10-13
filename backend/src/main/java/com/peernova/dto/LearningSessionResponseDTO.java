package com.peernova.dto;

import com.peernova.entity.SessionStatus;
import java.time.LocalDateTime;
import java.util.List;

public class LearningSessionResponseDTO {

    private Long id;
    private Long mentorProfileId;
    private String mentorName;
    private String mentorEmail;
    private String mentorCollege;

    private Long learnerProfileId;
    private String learnerName;
    private String learnerEmail;
    private String learnerCollege;

    private String skillTopic;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private String description;
    private SessionStatus status;
    private String meetingUrl;
    private String meetingRoomId;

    private String currentUserRole; // "MENTOR" or "LEARNER"
    private boolean attendedByCurrentUser;
    private List<SessionAttendanceDTO> attendances;
    private LocalDateTime createdAt;

    public LearningSessionResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMentorProfileId() {
        return mentorProfileId;
    }

    public void setMentorProfileId(Long mentorProfileId) {
        this.mentorProfileId = mentorProfileId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getMentorEmail() {
        return mentorEmail;
    }

    public void setMentorEmail(String mentorEmail) {
        this.mentorEmail = mentorEmail;
    }

    public String getMentorCollege() {
        return mentorCollege;
    }

    public void setMentorCollege(String mentorCollege) {
        this.mentorCollege = mentorCollege;
    }

    public Long getLearnerProfileId() {
        return learnerProfileId;
    }

    public void setLearnerProfileId(Long learnerProfileId) {
        this.learnerProfileId = learnerProfileId;
    }

    public String getLearnerName() {
        return learnerName;
    }

    public void setLearnerName(String learnerName) {
        this.learnerName = learnerName;
    }

    public String getLearnerEmail() {
        return learnerEmail;
    }

    public void setLearnerEmail(String learnerEmail) {
        this.learnerEmail = learnerEmail;
    }

    public String getLearnerCollege() {
        return learnerCollege;
    }

    public void setLearnerCollege(String learnerCollege) {
        this.learnerCollege = learnerCollege;
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

    public String getCurrentUserRole() {
        return currentUserRole;
    }

    public void setCurrentUserRole(String currentUserRole) {
        this.currentUserRole = currentUserRole;
    }

    public boolean isAttendedByCurrentUser() {
        return attendedByCurrentUser;
    }

    public void setAttendedByCurrentUser(boolean attendedByCurrentUser) {
        this.attendedByCurrentUser = attendedByCurrentUser;
    }

    public List<SessionAttendanceDTO> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<SessionAttendanceDTO> attendances) {
        this.attendances = attendances;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
