package com.peernova.dto;

import com.peernova.entity.Certificate;
import com.peernova.entity.CertificateType;
import java.time.LocalDateTime;

public class CertificateDTO {

    private Long id;
    private String certificateNumber;
    private String verificationCode;
    private Long recipientProfileId;
    private String recipientName;
    private String recipientEmail;
    private CertificateType certificateType;
    private String title;
    private String subjectName;
    private String description;
    private Double score;
    private String issuerName;
    private LocalDateTime issuedAt;
    private Long skillTestId;
    private Long learningSessionId;

    public CertificateDTO() {
    }

    public static CertificateDTO fromEntity(Certificate c) {
        CertificateDTO dto = new CertificateDTO();
        dto.setId(c.getId());
        dto.setCertificateNumber(c.getCertificateNumber());
        dto.setVerificationCode(c.getVerificationCode());
        if (c.getRecipient() != null) {
            dto.setRecipientProfileId(c.getRecipient().getId());
            if (c.getRecipient().getUser() != null) {
                dto.setRecipientName(c.getRecipient().getUser().getFullName());
                dto.setRecipientEmail(c.getRecipient().getUser().getEmail());
            }
        }
        if (dto.getRecipientName() == null) {
            dto.setRecipientName(c.getRecipientName());
        }
        dto.setCertificateType(c.getCertificateType());
        dto.setTitle(c.getTitle());
        dto.setSubjectName(c.getSubjectName());
        dto.setDescription(c.getDescription());
        dto.setScore(c.getScore());
        dto.setIssuerName(c.getIssuerName());
        dto.setIssuedAt(c.getIssuedAt());
        if (c.getSkillTest() != null) {
            dto.setSkillTestId(c.getSkillTest().getId());
        }
        if (c.getLearningSession() != null) {
            dto.setLearningSessionId(c.getLearningSession().getId());
        }
        return dto;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Long getRecipientProfileId() {
        return recipientProfileId;
    }

    public void setRecipientProfileId(Long recipientProfileId) {
        this.recipientProfileId = recipientProfileId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public CertificateType getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(CertificateType certificateType) {
        this.certificateType = certificateType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public void setIssuerName(String issuerName) {
        this.issuerName = issuerName;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public Long getSkillTestId() {
        return skillTestId;
    }

    public void setSkillTestId(Long skillTestId) {
        this.skillTestId = skillTestId;
    }

    public Long getLearningSessionId() {
        return learningSessionId;
    }

    public void setLearningSessionId(Long learningSessionId) {
        this.learningSessionId = learningSessionId;
    }
}
