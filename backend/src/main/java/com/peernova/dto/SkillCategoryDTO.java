package com.peernova.dto;

import java.util.ArrayList;
import java.util.List;

public class SkillCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String iconName;
    private List<String> popularSkills = new ArrayList<>();

    public SkillCategoryDTO() {
    }

    public SkillCategoryDTO(Long id, String name, String description, String iconName, List<String> popularSkills) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.popularSkills = popularSkills;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public List<String> getPopularSkills() {
        return popularSkills;
    }

    public void setPopularSkills(List<String> popularSkills) {
        this.popularSkills = popularSkills;
    }
}
