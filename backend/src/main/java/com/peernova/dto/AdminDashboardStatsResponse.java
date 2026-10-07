package com.peernova.dto;

public class AdminDashboardStatsResponse {
    private long totalStudents;
    private long pendingVerifications;
    private long approvedStudents;
    private long rejectedStudents;

    public AdminDashboardStatsResponse() {
    }

    public AdminDashboardStatsResponse(long totalStudents, long pendingVerifications, long approvedStudents, long rejectedStudents) {
        this.totalStudents = totalStudents;
        this.pendingVerifications = pendingVerifications;
        this.approvedStudents = approvedStudents;
        this.rejectedStudents = rejectedStudents;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getPendingVerifications() {
        return pendingVerifications;
    }

    public void setPendingVerifications(long pendingVerifications) {
        this.pendingVerifications = pendingVerifications;
    }

    public long getApprovedStudents() {
        return approvedStudents;
    }

    public void setApprovedStudents(long approvedStudents) {
        this.approvedStudents = approvedStudents;
    }

    public long getRejectedStudents() {
        return rejectedStudents;
    }

    public void setRejectedStudents(long rejectedStudents) {
        this.rejectedStudents = rejectedStudents;
    }
}
