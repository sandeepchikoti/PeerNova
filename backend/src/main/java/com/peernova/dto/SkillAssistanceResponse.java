package com.peernova.dto;

import java.util.List;

public class SkillAssistanceResponse {
    private String skillName;
    private List<String> bulletPoints;
    private List<String> recommendedKeywords;

    public SkillAssistanceResponse() {}

    public SkillAssistanceResponse(String skillName, List<String> bulletPoints, List<String> recommendedKeywords) {
        this.skillName = skillName;
        this.bulletPoints = bulletPoints;
        this.recommendedKeywords = recommendedKeywords;
    }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public List<String> getBulletPoints() { return bulletPoints; }
    public void setBulletPoints(List<String> bulletPoints) { this.bulletPoints = bulletPoints; }

    public List<String> getRecommendedKeywords() { return recommendedKeywords; }
    public void setRecommendedKeywords(List<String> recommendedKeywords) { this.recommendedKeywords = recommendedKeywords; }
}
