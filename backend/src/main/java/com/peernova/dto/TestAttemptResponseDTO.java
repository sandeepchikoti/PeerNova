package com.peernova.dto;

import java.time.LocalDateTime;

public class TestAttemptResponseDTO {
    private Long id;
    private Long testId;
    private String testTitle;
    private String skillName;
    private Long studentProfileId;
    private String studentName;
    private String studentEmail;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private boolean isPassed;
    private LocalDateTime attemptedAt;

    public TestAttemptResponseDTO() {
    }

    public TestAttemptResponseDTO(Long id, Long testId, String testTitle, String skillName,
                                  Long studentProfileId, String studentName, String studentEmail,
                                  Integer score, Integer totalMarks, Double percentage,
                                  boolean isPassed, LocalDateTime attemptedAt) {
        this.id = id;
        this.testId = testId;
        this.testTitle = testTitle;
        this.skillName = skillName;
        this.studentProfileId = studentProfileId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.isPassed = isPassed;
        this.attemptedAt = attemptedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTestTitle() {
        return testTitle;
    }

    public void setTestTitle(String testTitle) {
        this.testTitle = testTitle;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public boolean isPassed() {
        return isPassed;
    }

    public void setPassed(boolean passed) {
        isPassed = passed;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
