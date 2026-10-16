package com.peernova.dto;

import java.util.List;

public class ExperienceItem {
    private String role;
    private String organization;
    private String location;
    private String startDate;
    private String endDate;
    private Boolean current;
    private String description;
    private List<String> highlights;

    public ExperienceItem() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public Boolean getCurrent() { return current; }
    public void setCurrent(Boolean current) { this.current = current; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
}
