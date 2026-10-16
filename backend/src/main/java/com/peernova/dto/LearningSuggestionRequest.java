package com.peernova.dto;

import java.util.List;

public class LearningSuggestionRequest {
    private String targetRole;
    private String careerGoal;
    private List<String> currentSkills;

    public LearningSuggestionRequest() {}

    public LearningSuggestionRequest(String targetRole, String careerGoal, List<String> currentSkills) {
        this.targetRole = targetRole;
        this.careerGoal = careerGoal;
        this.currentSkills = currentSkills;
    }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public List<String> getCurrentSkills() { return currentSkills; }
    public void setCurrentSkills(List<String> currentSkills) { this.currentSkills = currentSkills; }
}
