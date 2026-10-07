package com.peernova.service;

import com.peernova.dto.SkillMatchResponseDTO;
import com.peernova.dto.StudentSkillDTO;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    public List<SkillMatchResponseDTO> getSkillMatches(String currentEmail) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Current student profile not found"));

        List<StudentSkill> currentSkills = studentSkillRepository.findByStudentProfileId(currentProfile.getId());
        Set<String> currentTeachingNames = currentSkills.stream()
                .filter(s -> s.getSkillType() == SkillType.TEACH)
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

        Set<String> currentLearningNames = currentSkills.stream()
                .filter(s -> s.getSkillType() == SkillType.LEARN)
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

        List<StudentProfile> allProfiles = studentProfileRepository.findAll();
        List<SkillMatchResponseDTO> matches = new ArrayList<>();

        for (StudentProfile peerProfile : allProfiles) {
            if (peerProfile.getId().equals(currentProfile.getId()) || 
                peerProfile.getUser() == null || 
                peerProfile.getUser().getRole() != Role.ROLE_STUDENT) {
                continue;
            }

            List<StudentSkill> peerSkills = studentSkillRepository.findByStudentProfileId(peerProfile.getId());

            // Skills peer CAN TEACH that current student WANTS TO LEARN
            List<StudentSkillDTO> peerCanTeachUs = peerSkills.stream()
                    .filter(s -> s.getSkillType() == SkillType.TEACH && currentLearningNames.contains(s.getSkillName().trim().toLowerCase()))
                    .map(this::mapSkillToDTO)
                    .collect(Collectors.toList());

            // Skills WE CAN TEACH that peer WANTS TO LEARN
            List<StudentSkillDTO> weCanTeachPeer = peerSkills.stream()
                    .filter(s -> s.getSkillType() == SkillType.LEARN && currentTeachingNames.contains(s.getSkillName().trim().toLowerCase()))
                    .map(this::mapSkillToDTO)
                    .collect(Collectors.toList());

            if (peerCanTeachUs.isEmpty() && weCanTeachPeer.isEmpty()) {
                continue; // No skill match
            }

            SkillMatchResponseDTO match = new SkillMatchResponseDTO();
            match.setStudentId(peerProfile.getUser().getId());
            match.setProfileId(peerProfile.getId());
            match.setFullName(peerProfile.getUser().getFullName());
            match.setEmail(peerProfile.getUser().getEmail());
            match.setCollege(peerProfile.getCollege());
            match.setDepartment(peerProfile.getDepartment());
            match.setYearOfStudy(peerProfile.getYearOfStudy());
            match.setBio(peerProfile.getBio());
            match.setVerificationStatus(peerProfile.getVerificationStatus());
            match.setMatchingSkillsToTeach(peerCanTeachUs);
            match.setMatchingSkillsToLearn(weCanTeachPeer);

            // Determine Match Type & Compatibility Score
            if (!peerCanTeachUs.isEmpty() && !weCanTeachPeer.isEmpty()) {
                match.setMatchType("COMPLEMENTARY"); // Two-way mutual exchange
                int score = Math.min(98, 85 + (peerCanTeachUs.size() + weCanTeachPeer.size()) * 4);
                match.setMatchScore(score);
            } else {
                match.setMatchType("DIRECT_TEACH"); // One-way skill match
                int score = Math.min(85, 70 + peerCanTeachUs.size() * 5);
                match.setMatchScore(score);
            }

            // Check connection status
            Optional<Connection> connOpt = connectionRepository.findConnectionBetween(currentProfile.getId(), peerProfile.getId());
            if (connOpt.isPresent()) {
                Connection conn = connOpt.get();
                match.setConnectionId(conn.getId());
                if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                    match.setConnectionStatus("CONNECTED");
                } else if (conn.getStatus() == ConnectionStatus.PENDING) {
                    if (conn.getSender().getId().equals(currentProfile.getId())) {
                        match.setConnectionStatus("PENDING_SENT");
                    } else {
                        match.setConnectionStatus("PENDING_RECEIVED");
                    }
                } else {
                    match.setConnectionStatus("REJECTED");
                }
            } else {
                match.setConnectionStatus("NONE");
            }

            matches.add(match);
        }

        // Sort by Match Type (COMPLEMENTARY first) then by Match Score descending
        matches.sort((a, b) -> {
            if (a.getMatchType().equals(b.getMatchType())) {
                return Integer.compare(b.getMatchScore(), a.getMatchScore());
            }
            return a.getMatchType().equals("COMPLEMENTARY") ? -1 : 1;
        });

        return matches;
    }

    private StudentSkillDTO mapSkillToDTO(StudentSkill skill) {
        return new StudentSkillDTO(
                skill.getId(),
                skill.getSkillName(),
                skill.getCategoryName(),
                skill.getSkillType(),
                skill.getProficiencyLevel()
        );
    }
}
