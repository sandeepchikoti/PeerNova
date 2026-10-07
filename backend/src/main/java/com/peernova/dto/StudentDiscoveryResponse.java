package com.peernova.dto;

import com.peernova.entity.VerificationStatus;
import java.util.ArrayList;
import java.util.List;

public class StudentDiscoveryResponse {
    private Long studentId;
    private Long profileId;
    private String fullName;
    private String email;
    private String college;
    private String department;
    private String yearOfStudy;
    private String bio;
    private VerificationStatus verificationStatus;
    private List<StudentSkillDTO> teachingSkills = new ArrayList<>();
    private List<StudentSkillDTO> learningSkills = new ArrayList<>();

    public StudentDiscoveryResponse() {
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
}
