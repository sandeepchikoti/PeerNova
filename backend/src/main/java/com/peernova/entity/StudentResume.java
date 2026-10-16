package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_resumes")
public class StudentResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 200)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 50)
    private String phone;

    @Column(length = 100)
    private String location;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(name = "target_role", length = 100)
    private String targetRole;

    @Column(name = "education_json", columnDefinition = "LONGTEXT")
    private String educationJson;

    @Column(name = "experience_json", columnDefinition = "LONGTEXT")
    private String experienceJson;

    @Column(name = "projects_json", columnDefinition = "LONGTEXT")
    private String projectsJson;

    @Column(name = "skills_json", columnDefinition = "LONGTEXT")
    private String skillsJson;

    @Column(name = "certifications_json", columnDefinition = "LONGTEXT")
    private String certificationsJson;

    @Column(name = "achievements_json", columnDefinition = "LONGTEXT")
    private String achievementsJson;

    @Column(name = "selected_template", length = 50)
    private String selectedTemplate = "MODERN";

    @Column(name = "include_peernova_metrics")
    private Boolean includePeerNovaMetrics = true;

    @Column(name = "ats_score")
    private Integer atsScore = 80;

    @Column(name = "ats_feedback", columnDefinition = "TEXT")
    private String atsFeedback;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentResume() {
    }

    public StudentResume(User user) {
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getEducationJson() {
        return educationJson;
    }

    public void setEducationJson(String educationJson) {
        this.educationJson = educationJson;
    }

    public String getExperienceJson() {
        return experienceJson;
    }

    public void setExperienceJson(String experienceJson) {
        this.experienceJson = experienceJson;
    }

    public String getProjectsJson() {
        return projectsJson;
    }

    public void setProjectsJson(String projectsJson) {
        this.projectsJson = projectsJson;
    }

    public String getSkillsJson() {
        return skillsJson;
    }

    public void setSkillsJson(String skillsJson) {
        this.skillsJson = skillsJson;
    }

    public String getCertificationsJson() {
        return certificationsJson;
    }

    public void setCertificationsJson(String certificationsJson) {
        this.certificationsJson = certificationsJson;
    }

    public String getAchievementsJson() {
        return achievementsJson;
    }

    public void setAchievementsJson(String achievementsJson) {
        this.achievementsJson = achievementsJson;
    }

    public String getSelectedTemplate() {
        return selectedTemplate;
    }

    public void setSelectedTemplate(String selectedTemplate) {
        this.selectedTemplate = selectedTemplate;
    }

    public Boolean getIncludePeerNovaMetrics() {
        return includePeerNovaMetrics;
    }

    public void setIncludePeerNovaMetrics(Boolean includePeerNovaMetrics) {
        this.includePeerNovaMetrics = includePeerNovaMetrics;
    }

    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public String getAtsFeedback() {
        return atsFeedback;
    }

    public void setAtsFeedback(String atsFeedback) {
        this.atsFeedback = atsFeedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
