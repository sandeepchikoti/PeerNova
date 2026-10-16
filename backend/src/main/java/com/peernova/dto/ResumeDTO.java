package com.peernova.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ResumeDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String headline;
    private String summary;
    private String phone;
    private String location;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String targetRole;

    private List<EducationItem> education = new ArrayList<>();
    private List<ExperienceItem> experience = new ArrayList<>();
    private List<ProjectItem> projects = new ArrayList<>();
    private List<SkillCategoryItem> skillCategories = new ArrayList<>();
    private List<CertificationItem> certifications = new ArrayList<>();
    private List<AchievementItem> achievements = new ArrayList<>();

    private String selectedTemplate = "MODERN";
    private Boolean includePeerNovaMetrics = true;
    private Integer atsScore = 80;
    private String atsFeedback;

    // Live Ecosystem PeerNova Metrics (calculated in real time)
    private Double peerRating = 0.0;
    private Integer totalReviews = 0;
    private Integer completedSessionsCount = 0;
    private Integer verifiedSkillsCount = 0;
    private List<String> verifiedSkillBadges = new ArrayList<>();
    private List<CertificateDTO> peerNovaCertificates = new ArrayList<>();
    private LocalDateTime updatedAt;

    public ResumeDTO() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public List<EducationItem> getEducation() { return education; }
    public void setEducation(List<EducationItem> education) { this.education = education != null ? education : new ArrayList<>(); }

    public List<ExperienceItem> getExperience() { return experience; }
    public void setExperience(List<ExperienceItem> experience) { this.experience = experience != null ? experience : new ArrayList<>(); }

    public List<ProjectItem> getProjects() { return projects; }
    public void setProjects(List<ProjectItem> projects) { this.projects = projects != null ? projects : new ArrayList<>(); }

    public List<SkillCategoryItem> getSkillCategories() { return skillCategories; }
    public void setSkillCategories(List<SkillCategoryItem> skillCategories) { this.skillCategories = skillCategories != null ? skillCategories : new ArrayList<>(); }

    public List<CertificationItem> getCertifications() { return certifications; }
    public void setCertifications(List<CertificationItem> certifications) { this.certifications = certifications != null ? certifications : new ArrayList<>(); }

    public List<AchievementItem> getAchievements() { return achievements; }
    public void setAchievements(List<AchievementItem> achievements) { this.achievements = achievements != null ? achievements : new ArrayList<>(); }

    public String getSelectedTemplate() { return selectedTemplate; }
    public void setSelectedTemplate(String selectedTemplate) { this.selectedTemplate = selectedTemplate; }

    public Boolean getIncludePeerNovaMetrics() { return includePeerNovaMetrics; }
    public void setIncludePeerNovaMetrics(Boolean includePeerNovaMetrics) { this.includePeerNovaMetrics = includePeerNovaMetrics; }

    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }

    public String getAtsFeedback() { return atsFeedback; }
    public void setAtsFeedback(String atsFeedback) { this.atsFeedback = atsFeedback; }

    public Double getPeerRating() { return peerRating; }
    public void setPeerRating(Double peerRating) { this.peerRating = peerRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public Integer getCompletedSessionsCount() { return completedSessionsCount; }
    public void setCompletedSessionsCount(Integer completedSessionsCount) { this.completedSessionsCount = completedSessionsCount; }

    public Integer getVerifiedSkillsCount() { return verifiedSkillsCount; }
    public void setVerifiedSkillsCount(Integer verifiedSkillsCount) { this.verifiedSkillsCount = verifiedSkillsCount; }

    public List<String> getVerifiedSkillBadges() { return verifiedSkillBadges; }
    public void setVerifiedSkillBadges(List<String> verifiedSkillBadges) { this.verifiedSkillBadges = verifiedSkillBadges != null ? verifiedSkillBadges : new ArrayList<>(); }

    public List<CertificateDTO> getPeerNovaCertificates() { return peerNovaCertificates; }
    public void setPeerNovaCertificates(List<CertificateDTO> peerNovaCertificates) { this.peerNovaCertificates = peerNovaCertificates != null ? peerNovaCertificates : new ArrayList<>(); }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
