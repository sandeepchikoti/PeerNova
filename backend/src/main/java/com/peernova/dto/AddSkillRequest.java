package com.peernova.dto;

import com.peernova.entity.ProficiencyLevel;
import com.peernova.entity.SkillType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddSkillRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String categoryName;

    @NotNull(message = "Skill type (TEACH/LEARN) is required")
    private SkillType skillType;

    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    public AddSkillRequest() {
    }

    public AddSkillRequest(String skillName, String categoryName, SkillType skillType, ProficiencyLevel proficiencyLevel) {
        this.skillName = skillName;
        this.categoryName = categoryName;
        this.skillType = skillType;
        this.proficiencyLevel = proficiencyLevel;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public SkillType getSkillType() {
        return skillType;
    }

    public void setSkillType(SkillType skillType) {
        this.skillType = skillType;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }
}
