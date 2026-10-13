package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_tests")
public class SkillTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(name = "category_name", length = 100)
    private String categoryName;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 15;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 5;

    @Column(name = "pass_percentage", nullable = false)
    private Double passPercentage = 70.0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SkillTest() {
    }

    public SkillTest(String title, String skillName, String categoryName, Integer durationMinutes,
                     Integer totalQuestions, Double passPercentage, String description) {
        this.title = title;
        this.skillName = skillName;
        this.categoryName = categoryName;
        this.durationMinutes = (durationMinutes != null && durationMinutes > 0) ? durationMinutes : 15;
        this.totalQuestions = (totalQuestions != null && totalQuestions > 0) ? totalQuestions : 5;
        this.passPercentage = (passPercentage != null && passPercentage > 0) ? passPercentage : 70.0;
        this.description = description;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
