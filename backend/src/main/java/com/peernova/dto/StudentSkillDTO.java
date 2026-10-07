package com.peernova.dto;

import com.peernova.entity.ProficiencyLevel;
import com.peernova.entity.SkillType;

public class StudentSkillDTO {
    private Long id;
    private String skillName;
    private String categoryName;
    private SkillType skillType;
    private ProficiencyLevel proficiencyLevel;

    public StudentSkillDTO() {
    }

    public StudentSkillDTO(Long id, String skillName, String categoryName, SkillType skillType, ProficiencyLevel proficiencyLevel) {
        this.id = id;
        this.skillName = skillName;
        this.categoryName = categoryName;
        this.skillType = skillType;
        this.proficiencyLevel = proficiencyLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
