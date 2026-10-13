package com.peernova.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TestResultDTO {
    private Long attemptId;
    private Long testId;
    private String testTitle;
    private String skillName;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private Double passPercentage;
    private boolean isPassed;
    private boolean verifiedBadgeGranted;
    private LocalDateTime attemptedAt;
    private List<QuestionFeedbackDTO> questionFeedback;

    public TestResultDTO() {
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
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

    public Double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(Double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public boolean isPassed() {
        return isPassed;
    }

    public void setPassed(boolean passed) {
        isPassed = passed;
    }

    public boolean isVerifiedBadgeGranted() {
        return verifiedBadgeGranted;
    }

    public void setVerifiedBadgeGranted(boolean verifiedBadgeGranted) {
        this.verifiedBadgeGranted = verifiedBadgeGranted;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    public List<QuestionFeedbackDTO> getQuestionFeedback() {
        return questionFeedback;
    }

    public void setQuestionFeedback(List<QuestionFeedbackDTO> questionFeedback) {
        this.questionFeedback = questionFeedback;
    }
}
