package com.peernova.dto;

import java.time.LocalDateTime;

public class SkillTestDTO {
    private Long id;
    private String title;
    private String skillName;
    private String categoryName;
    private Integer durationMinutes;
    private Integer totalQuestions;
    private Double passPercentage;
    private String description;
    private boolean isActive;
    private boolean hasPassedByStudent;
    private Double studentBestPercentage;
    private LocalDateTime createdAt;

    public SkillTestDTO() {
    }

    public SkillTestDTO(Long id, String title, String skillName, String categoryName,
                        Integer durationMinutes, Integer totalQuestions, Double passPercentage,
                        String description, boolean isActive, boolean hasPassedByStudent,
                        Double studentBestPercentage, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.skillName = skillName;
        this.categoryName = categoryName;
        this.durationMinutes = durationMinutes;
        this.totalQuestions = totalQuestions;
        this.passPercentage = passPercentage;
        this.description = description;
        this.isActive = isActive;
        this.hasPassedByStudent = hasPassedByStudent;
        this.studentBestPercentage = studentBestPercentage;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(Double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isHasPassedByStudent() {
        return hasPassedByStudent;
    }

    public void setHasPassedByStudent(boolean hasPassedByStudent) {
        this.hasPassedByStudent = hasPassedByStudent;
    }

    public Double getStudentBestPercentage() {
        return studentBestPercentage;
    }

    public void setStudentBestPercentage(Double studentBestPercentage) {
        this.studentBestPercentage = studentBestPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
