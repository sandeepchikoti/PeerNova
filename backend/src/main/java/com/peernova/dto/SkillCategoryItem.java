package com.peernova.dto;

import java.util.List;

public class SkillCategoryItem {
    private String category;
    private List<String> skills;

    public SkillCategoryItem() {}

    public SkillCategoryItem(String category, List<String> skills) {
        this.category = category;
        this.skills = skills;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}
