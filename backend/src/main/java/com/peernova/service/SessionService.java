package com.peernova.service;

import com.peernova.dto.*;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private SessionAttendanceRepository sessionAttendanceRepository;

    @Transactional
    public LearningSessionResponseDTO createSession(String currentEmail, CreateSessionRequest request) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + currentEmail));

        StudentProfile peerProfile = studentProfileRepository.findById(request.getPeerProfileId())
                .orElseThrow(() -> new RuntimeException("Peer profile not found with ID: " + request.getPeerProfileId()));

        if (currentProfile.getId().equals(peerProfile.getId())) {
            throw new RuntimeException("Cannot create a learning session with yourself.");
        }

        StudentProfile mentor;
        StudentProfile learner;

        if ("TEACH".equalsIgnoreCase(request.getSessionRole())) {
            mentor = currentProfile;
            learner = peerProfile;
        } else {
            mentor = peerProfile;
            learner = currentProfile;
        }

        String safeRoomSuffix = UUID.randomUUID().toString().substring(0, 8);
        String roomId = "peernova-session-" + System.currentTimeMillis() + "-" + safeRoomSuffix;
        String meetingUrl = "https://meet.jit.si/" + roomId;

        LocalDateTime scheduledTime = request.getScheduledAt() != null ? request.getScheduledAt() : LocalDateTime.now().plusHours(2);
        int duration = (request.getDurationMinutes() != null && request.getDurationMinutes() > 0) ? request.getDurationMinutes() : 45;

        LearningSession session = new LearningSession(
                mentor,
                learner,
                request.getSkillTopic(),
                scheduledTime,
                duration,
                request.getDescription(),
                roomId,
                meetingUrl
        );

        LearningSession saved = learningSessionRepository.save(session);
        logger.info("Created learning session #{} on topic '{}' between mentor {} and learner {}",
                saved.getId(), saved.getSkillTopic(), mentor.getUser().getFullName(), learner.getUser().getFullName());

        return mapToDTO(saved, currentProfile.getId());
    }

    @Transactional
    public LearningSessionResponseDTO updateSessionStatus(String currentEmail, Long sessionId, UpdateSessionStatusRequest request) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + currentEmail));

        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Learning session not found with ID: " + sessionId));

        boolean isMentor = session.getMentor().getId().equals(currentProfile.getId());
        boolean isLearner = session.getLearner().getId().equals(currentProfile.getId());

        if (!isMentor && !isLearner) {
            throw new RuntimeException("You are not authorized to update this session.");
        }

        SessionStatus newStatus = request.getStatus();
        session.setStatus(newStatus);
        LearningSession updated = learningSessionRepository.save(session);
        logger.info("Updated learning session #{} status to {}", sessionId, newStatus);

        return mapToDTO(updated, currentProfile.getId());
    }

    @Transactional
    public SessionAttendanceDTO markAttendance(String currentEmail, Long sessionId, MarkAttendanceRequest request) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Learning session not found with ID: " + sessionId));

        boolean isParticipant = session.getMentor().getId().equals(currentProfile.getId()) ||
                session.getLearner().getId().equals(currentProfile.getId());

        if (!isParticipant) {
            throw new RuntimeException("You are not a registered participant of this session.");
        }

        if (session.getStatus() == SessionStatus.CANCELLED || session.getStatus() == SessionStatus.REJECTED) {
            throw new RuntimeException("Cannot mark attendance for a cancelled or rejected session.");
        }

        // If session was just REQUESTED, joining video meeting transitions it to CONFIRMED
        if (session.getStatus() == SessionStatus.REQUESTED) {
            session.setStatus(SessionStatus.CONFIRMED);
            learningSessionRepository.save(session);
        }

        Optional<SessionAttendance> existing = sessionAttendanceRepository.findBySessionIdAndStudentId(sessionId, currentProfile.getId());
        SessionAttendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(request.getStatus() != null ? request.getStatus() : AttendanceStatus.PRESENT);
            attendance.setJoinedAt(LocalDateTime.now());
            if (request.getRemarks() != null) {
                attendance.setRemarks(request.getRemarks());
            }
        } else {
            attendance = new SessionAttendance(
                    session,
                    currentProfile,
                    request.getStatus() != null ? request.getStatus() : AttendanceStatus.PRESENT,
                    request.getRemarks() != null ? request.getRemarks() : "Attended video meeting session"
            );
        }

        SessionAttendance saved = sessionAttendanceRepository.save(attendance);
        logger.info("Marked attendance for student {} in session #{}", currentProfile.getUser().getFullName(), sessionId);
        return mapAttendanceToDTO(saved);
    }

    public List<LearningSessionResponseDTO> getMySessions(String currentEmail) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        List<LearningSession> sessions = learningSessionRepository.findAllForStudent(currentProfile.getId());
        return sessions.stream()
                .map(s -> mapToDTO(s, currentProfile.getId()))
                .collect(Collectors.toList());
    }

    public LearningSessionResponseDTO getSessionById(String currentEmail, Long sessionId) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Learning session not found with ID: " + sessionId));

        return mapToDTO(session, currentProfile.getId());
    }

    public List<SessionAttendanceDTO> getSessionAttendances(Long sessionId) {
        return sessionAttendanceRepository.findBySessionId(sessionId).stream()
                .map(this::mapAttendanceToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionAttendanceDTO> getMyAttendanceHistory(String currentEmail) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return sessionAttendanceRepository.findByStudentIdOrderByJoinedAtDesc(currentProfile.getId()).stream()
                .map(this::mapAttendanceToDTO)
                .collect(Collectors.toList());
    }

    private LearningSessionResponseDTO mapToDTO(LearningSession session, Long currentProfileId) {
        LearningSessionResponseDTO dto = new LearningSessionResponseDTO();
        dto.setId(session.getId());

        dto.setMentorProfileId(session.getMentor().getId());
        dto.setMentorName(session.getMentor().getUser().getFullName());
        dto.setMentorEmail(session.getMentor().getUser().getEmail());
        dto.setMentorCollege(session.getMentor().getCollege());

        dto.setLearnerProfileId(session.getLearner().getId());
        dto.setLearnerName(session.getLearner().getUser().getFullName());
        dto.setLearnerEmail(session.getLearner().getUser().getEmail());
        dto.setLearnerCollege(session.getLearner().getCollege());

        dto.setSkillTopic(session.getSkillTopic());
        dto.setScheduledAt(session.getScheduledAt());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setDescription(session.getDescription());
        dto.setStatus(session.getStatus());
        dto.setMeetingUrl(session.getMeetingUrl());
        dto.setMeetingRoomId(session.getMeetingRoomId());
        dto.setCreatedAt(session.getCreatedAt());

        if (session.getMentor().getId().equals(currentProfileId)) {
            dto.setCurrentUserRole("MENTOR");
        } else {
            dto.setCurrentUserRole("LEARNER");
        }

        List<SessionAttendance> attendances = sessionAttendanceRepository.findBySessionId(session.getId());
        dto.setAttendances(attendances.stream().map(this::mapAttendanceToDTO).collect(Collectors.toList()));

        boolean attended = attendances.stream().anyMatch(a -> a.getStudent().getId().equals(currentProfileId) && a.getStatus() == AttendanceStatus.PRESENT);
        dto.setAttendedByCurrentUser(attended);

        return dto;
    }

    private SessionAttendanceDTO mapAttendanceToDTO(SessionAttendance a) {
        return new SessionAttendanceDTO(
                a.getId(),
                a.getSession().getId(),
                a.getStudent().getId(),
                a.getStudent().getUser().getFullName(),
                a.getStudent().getUser().getEmail(),
                a.getStatus(),
                a.getJoinedAt(),
                a.getRemarks()
        );
    }
}
