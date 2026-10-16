package com.peernova.dto;

import java.util.List;

public class RoadmapMilestone {
    private String phaseNumber;
    private String title;
    private String duration;
    private List<String> skillsToAcquire;
    private String handsOnProject;
    private String peerLearningGoal;

    public RoadmapMilestone() {}

    public RoadmapMilestone(String phaseNumber, String title, String duration, List<String> skillsToAcquire, String handsOnProject, String peerLearningGoal) {
        this.phaseNumber = phaseNumber;
        this.title = title;
        this.duration = duration;
        this.skillsToAcquire = skillsToAcquire;
        this.handsOnProject = handsOnProject;
        this.peerLearningGoal = peerLearningGoal;
    }

    public String getPhaseNumber() { return phaseNumber; }
    public void setPhaseNumber(String phaseNumber) { this.phaseNumber = phaseNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public List<String> getSkillsToAcquire() { return skillsToAcquire; }
    public void setSkillsToAcquire(List<String> skillsToAcquire) { this.skillsToAcquire = skillsToAcquire; }

    public String getHandsOnProject() { return handsOnProject; }
    public void setHandsOnProject(String handsOnProject) { this.handsOnProject = handsOnProject; }

    public String getPeerLearningGoal() { return peerLearningGoal; }
    public void setPeerLearningGoal(String peerLearningGoal) { this.peerLearningGoal = peerLearningGoal; }
}
