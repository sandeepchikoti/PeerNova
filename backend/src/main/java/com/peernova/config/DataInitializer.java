package com.peernova.config;

import com.peernova.entity.*;
import com.peernova.repository.*;
import java.util.List;
import java.util.Optional;
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
    private ConnectionRepository connectionRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private SkillTestRepository skillTestRepository;

    @Autowired
    private TestQuestionRepository testQuestionRepository;

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

        // 4. Initialize sample connection & learning sessions if none exist
        if (learningSessionRepository.count() == 0 && studentProfileRepository.count() >= 2) {
            List<StudentProfile> students = studentProfileRepository.findAll();
            if (students.size() >= 2) {
                StudentProfile rithvik = students.get(0);
                StudentProfile sowmya = students.get(1);

                Optional<Connection> existingConn = connectionRepository.findConnectionBetween(rithvik.getId(), sowmya.getId());
                if (existingConn.isEmpty()) {
                    Connection conn = new Connection(rithvik, sowmya, "Hey Sowmya! Let's connect for peer mentoring on React and Spring Boot.");
                    conn.setStatus(ConnectionStatus.ACCEPTED);
                    connectionRepository.save(conn);
                }

                LearningSession session1 = new LearningSession(
                        sowmya, // Mentor: Sowmya teaches React
                        rithvik, // Learner: Rithvik learns React
                        "React State Management & Hooks Deep-Dive",
                        java.time.LocalDateTime.now().plusDays(1).withHour(17).withMinute(0),
                        60,
                        "Practical peer review of React state patterns, custom hooks, and frontend best practices.",
                        "peernova-session-react-deepdive",
                        "https://meet.jit.si/peernova-session-react-deepdive"
                );
                session1.setStatus(SessionStatus.CONFIRMED);
                learningSessionRepository.save(session1);

                LearningSession session2 = new LearningSession(
                        rithvik, // Mentor: Rithvik teaches Spring Boot
                        sowmya, // Learner: Sowmya learns Spring Boot
                        "Spring Boot REST APIs & MySQL Persistence",
                        java.time.LocalDateTime.now().plusDays(2).withHour(18).withMinute(30),
                        45,
                        "Building secure REST controllers, JPA repository queries, and JWT authentication filters.",
                        "peernova-session-springboot-arch",
                        "https://meet.jit.si/peernova-session-springboot-arch"
                );
                session2.setStatus(SessionStatus.CONFIRMED);
                learningSessionRepository.save(session2);

                logger.info("Seeded sample confirmed learning sessions for demo.");
            }
        }

        // 5. Initialize Skill Verification Assessments & Question Bank
        if (skillTestRepository.count() == 0) {
            seedSkillTestsAndQuestions();
            logger.info("Seeded skill verification assessments and MCQ question bank.");
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

    private void seedSkillTestsAndQuestions() {
        // Test 1: Java
        SkillTest javaTest = new SkillTest(
                "Java Core & OOP Assessment",
                "Java",
                "Programming Languages",
                15,
                5,
                70.0,
                "Demonstrate your mastery of core Java, OOP paradigms, JVM memory model, and collections framework."
        );
        javaTest = skillTestRepository.save(javaTest);

        seedQ(javaTest,
                "Which concept in Java allows a subclass to provide a specific implementation of a method already defined in its superclass?",
                "Method Overloading", "Method Overriding", "Encapsulation", "Multiple Inheritance",
                "B", "Method overriding allows a subclass to provide a specific implementation of a method defined in a superclass with the exact same signature.");

        seedQ(javaTest,
                "In Java JVM memory architecture, where are instantiated objects stored?",
                "Stack memory", "Heap memory", "Method Area / Metaspace", "Program Counter Register",
                "B", "Objects in Java are dynamically allocated in the Heap memory, while method call frames and local primitive references reside in the Stack.");

        seedQ(javaTest,
                "Which keyword prevents inheritance of a class or reassignment of a variable in Java?",
                "static", "synchronized", "final", "volatile",
                "C", "The final keyword prevents class subclassing, method overriding, and variable reassignment.");

        seedQ(javaTest,
                "What is the average time complexity of key-based retrieval in a well-distributed Java HashMap?",
                "O(n)", "O(log n)", "O(1)", "O(n^2)",
                "C", "HashMap uses bucket array indexing via hash codes to achieve average constant time O(1) retrieval.");

        seedQ(javaTest,
                "Which interface must be implemented by an entity to enable default sorting via Collections.sort() without an external comparator?",
                "Comparable", "Comparator", "Iterable", "Serializable",
                "A", "Implementing Comparable<T> provides natural sorting order via the compareTo() method.");

        // Test 2: React.js
        SkillTest reactTest = new SkillTest(
                "React.js & Frontend Architecture Assessment",
                "React.js",
                "Web Development",
                15,
                5,
                70.0,
                "Test your knowledge of React component lifecycle, Hooks, Virtual DOM reconciliation, and modern state patterns."
        );
        reactTest = skillTestRepository.save(reactTest);

        seedQ(reactTest,
                "Which built-in React Hook is specifically designed for side effects like data fetching and event subscriptions?",
                "useState", "useEffect", "useContext", "useMemo",
                "B", "useEffect runs side effects after component rendering cycles.");

        seedQ(reactTest,
                "What is the primary benefit of the Virtual DOM diffing reconciliation process in React?",
                "Direct continuous mutation of the real browser DOM",
                "Minimizing expensive native DOM reflows and repaints by computing batch updates",
                "Replacing the need for JavaScript execution in the browser",
                "Persisting frontend state across browser reloads",
                "B", "The Virtual DOM computes the minimal set of real DOM operations required, drastically improving rendering performance.");

        seedQ(reactTest,
                "How do you prevent unnecessary re-rendering of a functional component when its received props remain unchanged?",
                "React.memo", "useEffect", "useRef", "useId",
                "A", "Wrapping a functional component with React.memo memoizes the rendered output and skips re-renders if props are shallowly equal.");

        seedQ(reactTest,
                "What prop must be assigned to elements when rendering dynamic mapped lists in React?",
                "A stable unique 'key' prop", "A 'data-id' attribute", "An array index only", "A ref callback",
                "A", "The 'key' prop helps React identify which items have changed, been added, or removed during list reconciliation.");

        seedQ(reactTest,
                "What is the primary purpose of the useCallback Hook?",
                "To memoize an expensive calculated value",
                "To return a memoized callback function instance across renders to prevent unnecessary child re-renders",
                "To directly mutate the DOM hierarchy",
                "To register a WebSocket listener",
                "B", "useCallback caches function definitions between re-renders, useful when passing callbacks to optimized child components.");

        // Test 3: Spring Boot
        SkillTest springTest = new SkillTest(
                "Spring Boot REST APIs Assessment",
                "Spring Boot",
                "Web Development",
                15,
                5,
                70.0,
                "Verify your expertise in Spring Boot annotations, REST architectural design, Spring Data JPA, and security filters."
        );
        springTest = skillTestRepository.save(springTest);

        seedQ(springTest,
                "Which Spring annotation combines @Controller and @ResponseBody for building RESTful endpoints?",
                "@Service", "@RestController", "@Component", "@Repository",
                "B", "@RestController is a convenience annotation that marks the class as a controller where every method returns a domain object directly into the response body.");

        seedQ(springTest,
                "What is the primary architectural purpose of Spring Data JPA Repositories?",
                "Compiling Java bytecode into native machine instructions",
                "Providing automated CRUD query operations and finder method derivation without writing boilerplate SQL",
                "Running background WebSocket polling tasks",
                "Serving static CSS and JavaScript files",
                "B", "Spring Data JPA repositories dramatically reduce data access boilerplate by generating queries from method signatures.");

        seedQ(springTest,
                "Which standard HTTP response status code indicates that a new resource has been created successfully?",
                "200 OK", "201 Created", "204 No Content", "400 Bad Request",
                "B", "HTTP 201 Created is the standard response for successful POST creation requests.");

        seedQ(springTest,
                "Which Spring Security class is typically extended to inspect and validate Bearer JWT headers on incoming HTTP requests?",
                "OncePerRequestFilter", "BasicAuthenticationFilter", "CorsFilter", "CsrfFilter",
                "A", "OncePerRequestFilter guarantees single execution per request dispatch, ideal for parsing and validating Bearer tokens in SecurityContext.");

        seedQ(springTest,
                "What is the default Spring Bean scope managed by the ApplicationContext?",
                "Prototype", "Singleton", "Request", "Session",
                "B", "By default, Spring Beans are created as singletons — exactly one shared instance per Spring IoC container.");

        // Test 4: Python
        SkillTest pythonTest = new SkillTest(
                "Python Scripting & Data Science Assessment",
                "Python",
                "Programming Languages",
                15,
                5,
                70.0,
                "Evaluate your proficiency in Python core structures, immutability, vectorization, and data manipulation."
        );
        pythonTest = skillTestRepository.save(pythonTest);

        seedQ(pythonTest,
                "Which core built-in sequence data structure in Python is immutable?",
                "List", "Dictionary", "Tuple", "Set",
                "C", "Tuples in Python cannot be modified (elements cannot be added, removed, or changed) once created.");

        seedQ(pythonTest,
                "Which library provides the high-performance N-dimensional array object foundational to scientific computing in Python?",
                "NumPy", "Flask", "Requests", "BeautifulSoup",
                "A", "NumPy is the core numerical computing library providing fast ndarrays and vectorized operations.");

        seedQ(pythonTest,
                "In Python boolean evaluation, what does bool([]) evaluate to?",
                "True", "False", "None", "Raises an Exception",
                "B", "Empty collections (lists, dicts, tuples, sets) evaluate to False in Python truthiness checks.");

        seedQ(pythonTest,
                "Which Scikit-learn function calculates the cosine of the angle between student multi-hot skill feature vectors?",
                "euclidean_distances", "cosine_similarity", "r2_score", "accuracy_score",
                "B", "cosine_similarity calculates normalized dot-product angular distance between vectors, ideal for high-dimensional skill spaces.");

        seedQ(pythonTest,
                "Which keyword in Python is used to define small anonymous inline functions?",
                "def", "func", "lambda", "inline",
                "C", "The lambda keyword creates anonymous single-expression functions in Python.");
    }

    private void seedQ(SkillTest test, String text, String a, String b, String c, String d, String correct, String explanation) {
        TestQuestion q = new TestQuestion(test, text, a, b, c, d, correct, explanation, 1);
        testQuestionRepository.save(q);
    }
}
