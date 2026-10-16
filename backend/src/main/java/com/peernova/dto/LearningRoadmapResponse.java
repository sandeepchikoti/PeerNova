package com.peernova.dto;

import java.util.List;

public class LearningRoadmapResponse {
    private String targetRole;
    private Integer readinessScore;
    private String executiveSummary;
    private List<String> missingCrucialSkills;
    private List<RoadmapMilestone> milestones;
    private List<String> peerNovaActionPlan;

    public LearningRoadmapResponse() {}

    public LearningRoadmapResponse(String targetRole, Integer readinessScore, String executiveSummary, List<String> missingCrucialSkills, List<RoadmapMilestone> milestones, List<String> peerNovaActionPlan) {
        this.targetRole = targetRole;
        this.readinessScore = readinessScore;
        this.executiveSummary = executiveSummary;
        this.missingCrucialSkills = missingCrucialSkills;
        this.milestones = milestones;
        this.peerNovaActionPlan = peerNovaActionPlan;
    }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public Integer getReadinessScore() { return readinessScore; }
    public void setReadinessScore(Integer readinessScore) { this.readinessScore = readinessScore; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public List<String> getMissingCrucialSkills() { return missingCrucialSkills; }
    public void setMissingCrucialSkills(List<String> missingCrucialSkills) { this.missingCrucialSkills = missingCrucialSkills; }

    public List<RoadmapMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<RoadmapMilestone> milestones) { this.milestones = milestones; }

    public List<String> getPeerNovaActionPlan() { return peerNovaActionPlan; }
    public void setPeerNovaActionPlan(List<String> peerNovaActionPlan) { this.peerNovaActionPlan = peerNovaActionPlan; }
}
