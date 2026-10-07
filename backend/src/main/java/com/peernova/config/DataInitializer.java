package com.peernova.config;

import com.peernova.entity.*;
import com.peernova.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize default Admin if missing
        if (!userRepository.existsByEmail("admin@peernova.edu")) {
            User admin = new User(
                    "System Administrator",
                    "admin@peernova.edu",
                    passwordEncoder.encode("Admin@123"),
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
            logger.info("Created default Admin user: admin@peernova.edu / Admin@123");
        }

        // 2. Initialize Skill Categories catalog
        if (skillCategoryRepository.count() == 0) {
            SkillCategory prog = createCategory("Programming Languages", "Core languages including Java, Python, C++, Go, and Rust.", "Code");
            SkillCategory web = createCategory("Web Development", "Frontend & Backend frameworks like React, Spring Boot, Node.js.", "Globe");
            SkillCategory ds = createCategory("Data Science & AI", "Machine learning algorithms, Pandas, Data Mining, and Deep Learning.", "Cpu");
            SkillCategory cs = createCategory("Core Computer Science", "Data Structures, Algorithms, OS, Computer Networks, DBMS.", "BookOpen");
            SkillCategory cloud = createCategory("Cloud & DevOps", "Docker, Kubernetes, AWS, Linux system administration.", "Cloud");
            SkillCategory mobile = createCategory("Mobile Development", "Flutter, Android SDK, React Native cross-platform apps.", "Smartphone");

            seedSkill("Java", prog);
            seedSkill("Python", prog);
            seedSkill("C++", prog);

            seedSkill("React.js", web);
            seedSkill("Spring Boot", web);
            seedSkill("Node.js", web);
            seedSkill("HTML/CSS", web);

            seedSkill("Machine Learning", ds);
            seedSkill("Pandas & NumPy", ds);
            seedSkill("SQL & MySQL", ds);

            seedSkill("Data Structures & Algorithms", cs);
            seedSkill("Operating Systems", cs);

            seedSkill("Docker & Containers", cloud);
            seedSkill("Git & Version Control", cloud);

            seedSkill("Flutter", mobile);
            seedSkill("Android Kotlin", mobile);

            logger.info("Seeded default skill categories and skill catalog.");
        }

        // 3. Initialize sample students if count is low
        if (userRepository.countByRole(Role.ROLE_STUDENT) == 0) {
            StudentProfile rithvik = createSampleStudent("Rithvik Reddy", "rithvik.reddy@malla-reddy.edu", "Student@123",
                    "Malla Reddy University", "Computer Science & Engineering", "4th Year",
                    "Full-stack enthusiast passionate about Java backend development and data structures. Looking for React and Spring Boot learning partners.",
                    VerificationStatus.PENDING);

            addSkill(rithvik, "Java", "Programming Languages", SkillType.TEACH, ProficiencyLevel.ADVANCED);
            addSkill(rithvik, "Spring Boot", "Web Development", SkillType.TEACH, ProficiencyLevel.INTERMEDIATE);
            addSkill(rithvik, "React.js", "Web Development", SkillType.LEARN, ProficiencyLevel.BEGINNER);

            StudentProfile sowmya = createSampleStudent("Sowmya Rao", "sowmya.rao@malla-reddy.edu", "Student@123",
                    "Malla Reddy University", "Computer Science & Engineering", "4th Year",
                    "Frontend developer & UI designer. Passionate about building clean user interfaces and learning backend architecture.",
                    VerificationStatus.VERIFIED);

            addSkill(sowmya, "React.js", "Web Development", SkillType.TEACH, ProficiencyLevel.EXPERT);
            addSkill(sowmya, "HTML/CSS", "Web Development", SkillType.TEACH, ProficiencyLevel.ADVANCED);
            addSkill(sowmya, "Spring Boot", "Web Development", SkillType.LEARN, ProficiencyLevel.BEGINNER);
            addSkill(sowmya, "Java", "Programming Languages", SkillType.LEARN, ProficiencyLevel.INTERMEDIATE);

            StudentProfile manasa = createSampleStudent("Manasa Sharma", "manasa.sharma@jntuh.ac.in", "Student@123",
                    "JNTU Hyderabad", "Information Technology", "3rd Year",
                    "Curious programmer exploring Python scripting, relational databases, and cloud fundamentals.",
                    VerificationStatus.PENDING);

            addSkill(manasa, "Python", "Programming Languages", SkillType.TEACH, ProficiencyLevel.INTERMEDIATE);
            addSkill(manasa, "SQL & MySQL", "Data Science & AI", SkillType.TEACH, ProficiencyLevel.INTERMEDIATE);
            addSkill(manasa, "Machine Learning", "Data Science & AI", SkillType.LEARN, ProficiencyLevel.BEGINNER);

            StudentProfile sandeep = createSampleStudent("Sandeep Kumar", "sandeep.kumar@iith.ac.in", "Student@123",
                    "IIT Hyderabad", "Computer Science & Engineering", "4th Year",
                    "Competitive programmer & algorithms peer mentor. Eager to explore containerization and DevOps practices.",
                    VerificationStatus.VERIFIED);

            addSkill(sandeep, "Data Structures & Algorithms", "Core Computer Science", SkillType.TEACH, ProficiencyLevel.EXPERT);
            addSkill(sandeep, "C++", "Programming Languages", SkillType.TEACH, ProficiencyLevel.ADVANCED);
            addSkill(sandeep, "Docker & Containers", "Cloud & DevOps", SkillType.LEARN, ProficiencyLevel.BEGINNER);

            logger.info("Seeded initial sample students with teaching and learning skills.");
        }
    }

    private SkillCategory createCategory(String name, String desc, String icon) {
        SkillCategory cat = new SkillCategory(name, desc, icon);
        return skillCategoryRepository.save(cat);
    }

    private void seedSkill(String name, SkillCategory category) {
        Skill skill = new Skill(name, category);
        skillRepository.save(skill);
    }

    private StudentProfile createSampleStudent(String name, String email, String password, String college, String dept, String year, String bio, VerificationStatus status) {
        User student = new User(name, email, passwordEncoder.encode(password), Role.ROLE_STUDENT);
        userRepository.save(student);

        StudentProfile profile = new StudentProfile(student, college, dept, year, bio);
        profile.setVerificationStatus(status);
        return studentProfileRepository.save(profile);
    }

    private void addSkill(StudentProfile profile, String skillName, String catName, SkillType type, ProficiencyLevel level) {
        StudentSkill ss = new StudentSkill(profile, skillName, catName, type, level);
        studentSkillRepository.save(ss);
    }
}
