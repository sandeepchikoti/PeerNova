package com.peernova.dto;

public class CertificationItem {
    private String title;
    private String issuer;
    private String issueDate;
    private String credentialUrl;
    private String verificationId;
    private Boolean isPeerNovaVerified;

    public CertificationItem() {}

    public CertificationItem(String title, String issuer, String issueDate, String credentialUrl, String verificationId, Boolean isPeerNovaVerified) {
        this.title = title;
        this.issuer = issuer;
        this.issueDate = issueDate;
        this.credentialUrl = credentialUrl;
        this.verificationId = verificationId;
        this.isPeerNovaVerified = isPeerNovaVerified;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getCredentialUrl() { return credentialUrl; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }

    public String getVerificationId() { return verificationId; }
    public void setVerificationId(String verificationId) { this.verificationId = verificationId; }

    public Boolean getIsPeerNovaVerified() { return isPeerNovaVerified; }
    public void setIsPeerNovaVerified(Boolean isPeerNovaVerified) { this.isPeerNovaVerified = isPeerNovaVerified; }
}
