package com.peernova.dto;

import com.peernova.entity.VerificationStatus;
import java.util.ArrayList;
import java.util.List;

public class MlRecommendationResponseDTO {
    private Long studentId;
    private Long profileId;
    private String fullName;
    private String email;
    private String college;
    private String department;
    private String yearOfStudy;
    private String bio;
    private VerificationStatus verificationStatus;

    private double mlScore;
    private double cosineSimilarity;
    private double knnDistance;
    private int clusterId;
    private String algorithmBreakdown;
    private String mlExplanation;

    private List<StudentSkillDTO> teachingSkills = new ArrayList<>();
    private List<StudentSkillDTO> learningSkills = new ArrayList<>();

    private String connectionStatus = "NONE";
    private Long connectionId;

    public MlRecommendationResponseDTO() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(String yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public double getMlScore() {
        return mlScore;
    }

    public void setMlScore(double mlScore) {
        this.mlScore = mlScore;
    }

    public double getCosineSimilarity() {
        return cosineSimilarity;
    }

    public void setCosineSimilarity(double cosineSimilarity) {
        this.cosineSimilarity = cosineSimilarity;
    }

    public double getKnnDistance() {
        return knnDistance;
    }

    public void setKnnDistance(double knnDistance) {
        this.knnDistance = knnDistance;
    }

    public int getClusterId() {
        return clusterId;
    }

    public void setClusterId(int clusterId) {
        this.clusterId = clusterId;
    }

    public String getAlgorithmBreakdown() {
        return algorithmBreakdown;
    }

    public void setAlgorithmBreakdown(String algorithmBreakdown) {
        this.algorithmBreakdown = algorithmBreakdown;
    }

    public String getMlExplanation() {
        return mlExplanation;
    }

    public void setMlExplanation(String mlExplanation) {
        this.mlExplanation = mlExplanation;
    }

    public List<StudentSkillDTO> getTeachingSkills() {
        return teachingSkills;
    }

    public void setTeachingSkills(List<StudentSkillDTO> teachingSkills) {
        this.teachingSkills = teachingSkills;
    }

    public List<StudentSkillDTO> getLearningSkills() {
        return learningSkills;
    }

    public void setLearningSkills(List<StudentSkillDTO> learningSkills) {
        this.learningSkills = learningSkills;
    }

    public String getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(String connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }
}
