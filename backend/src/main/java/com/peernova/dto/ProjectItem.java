package com.peernova.dto;

import java.util.List;

public class ProjectItem {
    private String title;
    private String techStack;
    private String githubUrl;
    private String liveUrl;
    private String description;
    private List<String> highlights;

    public ProjectItem() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
}
