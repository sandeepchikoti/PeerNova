package com.peernova.service;

import com.peernova.dto.StudentDiscoveryResponse;
import com.peernova.dto.StudentSkillDTO;
import com.peernova.entity.Role;
import com.peernova.entity.SkillType;
import com.peernova.entity.StudentProfile;
import com.peernova.entity.StudentSkill;
import com.peernova.repository.StudentProfileRepository;
import com.peernova.repository.StudentSkillRepository;
import com.peernova.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscoveryService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    public List<StudentDiscoveryResponse> discoverStudents(
            String currentEmail,
            String search,
            String category,
            String skillName,
            String skillTypeFilter,
            String proficiencyFilter,
            String collegeFilter) {

        List<StudentProfile> allProfiles = studentProfileRepository.findAll();
        List<StudentDiscoveryResponse> results = new ArrayList<>();

        for (StudentProfile profile : allProfiles) {
            // Exclude current student & admins
            if (profile.getUser() == null || profile.getUser().getRole() != Role.ROLE_STUDENT) {
                continue;
            }
            if (currentEmail != null && profile.getUser().getEmail().equalsIgnoreCase(currentEmail)) {
                continue;
            }

            List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(profile.getId());

            List<StudentSkillDTO> teachingSkills = skills.stream()
                    .filter(s -> s.getSkillType() == SkillType.TEACH)
                    .map(this::mapSkillToDTO)
                    .collect(Collectors.toList());

            List<StudentSkillDTO> learningSkills = skills.stream()
                    .filter(s -> s.getSkillType() == SkillType.LEARN)
                    .map(this::mapSkillToDTO)
                    .collect(Collectors.toList());

            // Check search filter (matches student name, college, department, or skill names)
            boolean matchesSearch = true;
            if (search != null && !search.isBlank()) {
                String q = search.trim().toLowerCase();
                boolean nameMatch = profile.getUser().getFullName().toLowerCase().contains(q);
                boolean collegeMatch = profile.getCollege() != null && profile.getCollege().toLowerCase().contains(q);
                boolean deptMatch = profile.getDepartment() != null && profile.getDepartment().toLowerCase().contains(q);
                boolean skillMatch = skills.stream().anyMatch(s -> s.getSkillName().toLowerCase().contains(q));
                matchesSearch = nameMatch || collegeMatch || deptMatch || skillMatch;
            }

            // Check Category filter
            boolean matchesCategory = true;
            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
                matchesCategory = skills.stream().anyMatch(s -> 
                    s.getCategoryName() != null && s.getCategoryName().equalsIgnoreCase(category.trim()));
            }

            // Check Skill Name filter
            boolean matchesSkillName = true;
            if (skillName != null && !skillName.isBlank()) {
                matchesSkillName = skills.stream().anyMatch(s -> 
                    s.getSkillName().equalsIgnoreCase(skillName.trim()));
            }

            // Check College filter
            boolean matchesCollege = true;
            if (collegeFilter != null && !collegeFilter.isBlank() && !collegeFilter.equalsIgnoreCase("ALL")) {
                matchesCollege = profile.getCollege() != null && profile.getCollege().equalsIgnoreCase(collegeFilter.trim());
            }

            if (matchesSearch && matchesCategory && matchesSkillName && matchesCollege) {
                StudentDiscoveryResponse resp = new StudentDiscoveryResponse();
                resp.setStudentId(profile.getUser().getId());
                resp.setProfileId(profile.getId());
                resp.setFullName(profile.getUser().getFullName());
                resp.setEmail(profile.getUser().getEmail());
                resp.setCollege(profile.getCollege());
                resp.setDepartment(profile.getDepartment());
                resp.setYearOfStudy(profile.getYearOfStudy());
                resp.setBio(profile.getBio());
                resp.setVerificationStatus(profile.getVerificationStatus());
                resp.setTeachingSkills(teachingSkills);
                resp.setLearningSkills(learningSkills);
                results.add(resp);
            }
        }

        return results;
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
