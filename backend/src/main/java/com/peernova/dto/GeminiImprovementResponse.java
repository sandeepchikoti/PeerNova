package com.peernova.dto;

import java.util.List;

public class GeminiImprovementResponse {
    private String originalText;
    private String improvedText;
    private List<String> keyEnhancements;
    private String roleAlignmentTip;

    public GeminiImprovementResponse() {}

    public GeminiImprovementResponse(String originalText, String improvedText, List<String> keyEnhancements, String roleAlignmentTip) {
        this.originalText = originalText;
        this.improvedText = improvedText;
        this.keyEnhancements = keyEnhancements;
        this.roleAlignmentTip = roleAlignmentTip;
    }

    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }

    public String getImprovedText() { return improvedText; }
    public void setImprovedText(String improvedText) { this.improvedText = improvedText; }

    public List<String> getKeyEnhancements() { return keyEnhancements; }
    public void setKeyEnhancements(List<String> keyEnhancements) { this.keyEnhancements = keyEnhancements; }

    public String getRoleAlignmentTip() { return roleAlignmentTip; }
    public void setRoleAlignmentTip(String roleAlignmentTip) { this.roleAlignmentTip = roleAlignmentTip; }
}
