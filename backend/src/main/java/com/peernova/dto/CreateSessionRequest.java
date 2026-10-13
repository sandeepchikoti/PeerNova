package com.peernova.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateSessionRequest {

    @NotNull(message = "Peer profile ID is required")
    private Long peerProfileId;

    @NotBlank(message = "Session role is required (TEACH or LEARN)")
    private String sessionRole; // "TEACH" (current user teaches) or "LEARN" (peer teaches current user)

    @NotBlank(message = "Skill or topic is required")
    private String skillTopic;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledAt;

    private Integer durationMinutes = 45;

    private String description;

    public CreateSessionRequest() {
    }

    public Long getPeerProfileId() {
        return peerProfileId;
    }

    public void setPeerProfileId(Long peerProfileId) {
        this.peerProfileId = peerProfileId;
    }

    public String getSessionRole() {
        return sessionRole;
    }

    public void setSessionRole(String sessionRole) {
        this.sessionRole = sessionRole;
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
}
