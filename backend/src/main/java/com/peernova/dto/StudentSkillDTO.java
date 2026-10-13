package com.peernova.dto;

import com.peernova.entity.ProficiencyLevel;
import com.peernova.entity.SkillType;

public class StudentSkillDTO {
    private Long id;
    private String skillName;
    private String categoryName;
    private SkillType skillType;
    private ProficiencyLevel proficiencyLevel;
    private boolean isVerified;
    private java.time.LocalDateTime verifiedAt;
    private Double verificationScore;

    public StudentSkillDTO() {
    }

    public StudentSkillDTO(Long id, String skillName, String categoryName, SkillType skillType, ProficiencyLevel proficiencyLevel) {
        this(id, skillName, categoryName, skillType, proficiencyLevel, false, null, null);
    }

    public StudentSkillDTO(Long id, String skillName, String categoryName, SkillType skillType,
                           ProficiencyLevel proficiencyLevel, boolean isVerified,
                           java.time.LocalDateTime verifiedAt, Double verificationScore) {
        this.id = id;
        this.skillName = skillName;
        this.categoryName = categoryName;
        this.skillType = skillType;
        this.proficiencyLevel = proficiencyLevel;
        this.isVerified = isVerified;
        this.verifiedAt = verifiedAt;
        this.verificationScore = verificationScore;
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

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public java.time.LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(java.time.LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public Double getVerificationScore() {
        return verificationScore;
    }

    public void setVerificationScore(Double verificationScore) {
        this.verificationScore = verificationScore;
    }
}
