package com.peernova.service;

import com.peernova.dto.AddSkillRequest;
import com.peernova.dto.SkillCategoryDTO;
import com.peernova.dto.StudentSkillDTO;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    public List<SkillCategoryDTO> getSkillCategories() {
        List<SkillCategory> categories = skillCategoryRepository.findAllByOrderByNameAsc();
        return categories.stream().map(cat -> {
            List<String> skills = skillRepository.findByCategoryId(cat.getId())
                    .stream().map(Skill::getName).collect(Collectors.toList());
            return new SkillCategoryDTO(cat.getId(), cat.getName(), cat.getDescription(), cat.getIconName(), skills);
        }).collect(Collectors.toList());
    }

    public List<StudentSkillDTO> getStudentSkills(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return studentSkillRepository.findByStudentProfileId(profile.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentSkillDTO addStudentSkill(String email, AddSkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        String cleanSkillName = request.getSkillName().trim();

        if (studentSkillRepository.existsByStudentProfileIdAndSkillNameAndSkillType(
                profile.getId(), cleanSkillName, request.getSkillType())) {
            throw new RuntimeException("You have already added '" + cleanSkillName + "' to your " + request.getSkillType().name().toLowerCase() + " skills list.");
        }

        StudentSkill studentSkill = new StudentSkill(
                profile,
                cleanSkillName,
                request.getCategoryName() != null ? request.getCategoryName().trim() : "General",
                request.getSkillType(),
                request.getProficiencyLevel()
        );

        StudentSkill saved = studentSkillRepository.save(studentSkill);
        return mapToDTO(saved);
    }

    @Transactional
    public void removeStudentSkill(String email, Long skillId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        studentSkillRepository.deleteByStudentProfileIdAndId(profile.getId(), skillId);
    }

    private StudentSkillDTO mapToDTO(StudentSkill skill) {
        return new StudentSkillDTO(
                skill.getId(),
                skill.getSkillName(),
                skill.getCategoryName(),
                skill.getSkillType(),
                skill.getProficiencyLevel()
        );
    }
}
