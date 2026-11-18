package com.smart.student.service;

import com.smart.student.dto.*;
import com.smart.student.entity.Role;
import com.smart.student.entity.Student;
import com.smart.student.entity.Teacher;
import com.smart.student.entity.User;
import com.smart.student.exception.DuplicateResourceException;
import com.smart.student.repository.StudentRepository;
import com.smart.student.repository.TeacherRepository;
import com.smart.student.repository.UserRepository;
import com.smart.student.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentRepository studentRepository,
                       TeacherRepository teacherRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername().trim(),
                        loginRequest.getPassword().trim()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getUsername()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );

        // Link student/teacher ID if applicable
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentRepository.findByUserId(user.getId())
                    .or(() -> studentRepository.findByEmailIgnoreCase(user.getEmail()))
                    .ifPresent(s -> response.setStudentId(s.getId()));
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            teacherRepository.findByUserId(user.getId())
                    .or(() -> teacherRepository.findByEmailIgnoreCase(user.getEmail()))
                    .ifPresent(t -> response.setTeacherId(t.getId()));
        }

        return response;
    }

    @Transactional
    public UserProfileDto registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username '" + registerRequest.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email '" + registerRequest.getEmail() + "' is already registered");
        }

        User user = new User(
                registerRequest.getUsername().trim(),
                passwordEncoder.encode(registerRequest.getPassword().trim()),
                registerRequest.getEmail().trim(),
                registerRequest.getFullName().trim(),
                registerRequest.getRole()
        );

        User saved = userRepository.save(user);
        return new UserProfileDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getFullName(), saved.getRole().name());
    }

    public UserProfileDto getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        UserProfileDto profile = new UserProfileDto(user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole().name());
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentRepository.findByUserId(user.getId())
                    .or(() -> studentRepository.findByEmailIgnoreCase(user.getEmail()))
                    .ifPresent(s -> profile.setStudentId(s.getId()));
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            teacherRepository.findByUserId(user.getId())
                    .or(() -> teacherRepository.findByEmailIgnoreCase(user.getEmail()))
                    .ifPresent(t -> profile.setTeacherId(t.getId()));
        }
        return profile;
    }
}
