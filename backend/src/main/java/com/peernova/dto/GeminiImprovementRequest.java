package com.peernova.dto;

public class GeminiImprovementRequest {
    private String section; // SUMMARY, EXPERIENCE, PROJECT
    private String currentText;
    private String targetRole; // e.g. "Full Stack Developer", "Machine Learning Engineer"

    public GeminiImprovementRequest() {}

    public GeminiImprovementRequest(String section, String currentText, String targetRole) {
        this.section = section;
        this.currentText = currentText;
        this.targetRole = targetRole;
    }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getCurrentText() { return currentText; }
    public void setCurrentText(String currentText) { this.currentText = currentText; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}
