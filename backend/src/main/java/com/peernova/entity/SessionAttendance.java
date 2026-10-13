package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_attendances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"session_id", "student_profile_id"})
})
public class SessionAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private LearningSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "remarks")
    private String remarks;

    public SessionAttendance() {
    }

    public SessionAttendance(LearningSession session, StudentProfile student, AttendanceStatus status, String remarks) {
        this.session = session;
        this.student = student;
        this.status = (status != null) ? status : AttendanceStatus.PRESENT;
        this.joinedAt = LocalDateTime.now();
        this.remarks = remarks;
    }

    @PrePersist
    protected void onCreate() {
        if (this.joinedAt == null) {
            this.joinedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LearningSession getSession() {
        return session;
    }

    public void setSession(LearningSession session) {
        this.session = session;
    }

    public StudentProfile getStudent() {
        return student;
    }

    public void setStudent(StudentProfile student) {
        this.student = student;
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
