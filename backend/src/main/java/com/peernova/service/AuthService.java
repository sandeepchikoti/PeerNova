package com.peernova.service;

import com.peernova.dto.AuthResponse;
import com.peernova.dto.LoginRequest;
import com.peernova.dto.RegisterRequest;
import com.peernova.dto.StudentProfileResponse;
import com.peernova.entity.Role;
import com.peernova.entity.StudentProfile;
import com.peernova.entity.User;
import com.peernova.entity.VerificationStatus;
import com.peernova.repository.StudentProfileRepository;
import com.peernova.repository.UserRepository;
import com.peernova.security.JwtUtils;
import com.peernova.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        VerificationStatus verificationStatus = VerificationStatus.VERIFIED;
        if (user.getRole() == Role.ROLE_STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                    .orElse(null);
            if (profile != null) {
                verificationStatus = profile.getVerificationStatus();
            }
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                verificationStatus
        );
    }

    @Transactional
    public AuthResponse registerStudent(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already registered: " + registerRequest.getEmail());
        }

        User user = new User(
                registerRequest.getFullName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                Role.ROLE_STUDENT
        );

        User savedUser = userRepository.save(user);

        StudentProfile profile = new StudentProfile(
                savedUser,
                registerRequest.getCollege(),
                registerRequest.getDepartment(),
                registerRequest.getYearOfStudy(),
                registerRequest.getBio()
        );

        studentProfileRepository.save(profile);

        String jwt = jwtUtils.generateTokenFromEmail(savedUser.getEmail());

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                profile.getVerificationStatus()
        );
    }

    public StudentProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        StudentProfileResponse response = new StudentProfileResponse();
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        if (user.getRole() == Role.ROLE_STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                    .orElse(null);
            if (profile != null) {
                response.setId(profile.getId());
                response.setCollege(profile.getCollege());
                response.setDepartment(profile.getDepartment());
                response.setYearOfStudy(profile.getYearOfStudy());
                response.setBio(profile.getBio());
                response.setVerificationStatus(profile.getVerificationStatus());
                response.setCreatedAt(profile.getCreatedAt());
                response.setUpdatedAt(profile.getUpdatedAt());
            }
        }

        return response;
    }
}
