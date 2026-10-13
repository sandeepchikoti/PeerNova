package com.peernova.dto;

import com.peernova.entity.AttendanceStatus;
import java.time.LocalDateTime;

public class SessionAttendanceDTO {

    private Long id;
    private Long sessionId;
    private Long studentProfileId;
    private String studentName;
    private String studentEmail;
    private AttendanceStatus status;
    private LocalDateTime joinedAt;
    private String remarks;

    public SessionAttendanceDTO() {
    }

    public SessionAttendanceDTO(Long id, Long sessionId, Long studentProfileId, String studentName,
                                String studentEmail, AttendanceStatus status, LocalDateTime joinedAt, String remarks) {
        this.id = id;
        this.sessionId = sessionId;
        this.studentProfileId = studentProfileId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.status = status;
        this.joinedAt = joinedAt;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
