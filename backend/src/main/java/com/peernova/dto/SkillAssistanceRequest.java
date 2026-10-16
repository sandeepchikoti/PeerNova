package com.peernova.dto;

import java.util.List;

public class SkillAssistanceRequest {
    private String skillName;
    private String proficiency;
    private String context;

    public SkillAssistanceRequest() {}

    public SkillAssistanceRequest(String skillName, String proficiency, String context) {
        this.skillName = skillName;
        this.proficiency = proficiency;
        this.context = context;
    }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
