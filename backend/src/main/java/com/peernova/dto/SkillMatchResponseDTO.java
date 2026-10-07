package com.peernova.dto;

import com.peernova.entity.VerificationStatus;
import java.util.ArrayList;
import java.util.List;

public class SkillMatchResponseDTO {
    private Long studentId;
    private Long profileId;
    private String fullName;
    private String email;
    private String college;
    private String department;
    private String yearOfStudy;
    private String bio;
    private VerificationStatus verificationStatus;

    // "COMPLEMENTARY" (Mutual 2-way exchange) or "DIRECT_TEACH" (1-way skill match)
    private String matchType;
    private int matchScore; // Percentage e.g. 95%, 80%

    private List<StudentSkillDTO> matchingSkillsToTeach = new ArrayList<>(); // Skills peer can teach that current student wants to learn
    private List<StudentSkillDTO> matchingSkillsToLearn = new ArrayList<>(); // Skills current student can teach that peer wants to learn

    private String connectionStatus = "NONE"; // "NONE", "PENDING_SENT", "PENDING_RECEIVED", "CONNECTED", "REJECTED"
    private Long connectionId;

    public SkillMatchResponseDTO() {
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

    public String getMatchType() {
        return matchType;
    }

    public void setMatchType(String matchType) {
        this.matchType = matchType;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public List<StudentSkillDTO> getMatchingSkillsToTeach() {
        return matchingSkillsToTeach;
    }

    public void setMatchingSkillsToTeach(List<StudentSkillDTO> matchingSkillsToTeach) {
        this.matchingSkillsToTeach = matchingSkillsToTeach;
    }

    public List<StudentSkillDTO> getMatchingSkillsToLearn() {
        return matchingSkillsToLearn;
    }

    public void setMatchingSkillsToLearn(List<StudentSkillDTO> matchingSkillsToLearn) {
        this.matchingSkillsToLearn = matchingSkillsToLearn;
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
