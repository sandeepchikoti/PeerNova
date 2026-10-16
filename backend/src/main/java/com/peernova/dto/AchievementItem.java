package com.peernova.dto;

public class AchievementItem {
    private String title;
    private String description;
    private String year;

    public AchievementItem() {}

    public AchievementItem(String title, String description, String year) {
        this.title = title;
        this.description = description;
        this.year = year;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
}
