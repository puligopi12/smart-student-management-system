package com.smart.student.config;

import com.smart.student.entity.*;
import com.smart.student.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository,
                               StudentRepository studentRepository,
                               AttendanceRepository attendanceRepository,
                               MarksRepository marksRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Verifying initial database credentials & student statistics...");

        // Ensure Admin user
        userRepository.findByUsername("admin").ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(user);
        }, () -> {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@smartcampus.edu", "System Administrator", Role.ROLE_ADMIN);
            userRepository.save(admin);
        });

        // Ensure Teacher user
        userRepository.findByUsername("prof.rajesh").ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode("teacher123"));
            userRepository.save(user);
        }, () -> {
            User teacher = new User("prof.rajesh", passwordEncoder.encode("teacher123"), "rajesh.kumar@smartcampus.edu", "Dr. Rajesh Kumar", Role.ROLE_TEACHER);
            userRepository.save(teacher);
        });

        // Ensure Student user
        userRepository.findByUsername("rahul22").ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode("student123"));
            userRepository.save(user);
        }, () -> {
            User student = new User("rahul22", passwordEncoder.encode("student123"), "rahul.sharma@student.edu", "Rahul Sharma", Role.ROLE_STUDENT);
            userRepository.save(student);
        });

        // Update student attendance & average marks from tables if present
        List<Student> students = studentRepository.findAll();
        for (Student s : students) {
            long totalAttendance = attendanceRepository.countTotalByStudentId(s.getId());
            if (totalAttendance > 0) {
                long present = attendanceRepository.countPresentByStudentId(s.getId());
                double attPct = (double) present / totalAttendance * 100.0;
                s.setAttendancePercentage(Math.round(attPct * 10.0) / 10.0);
            }
            Double avgMarks = marksRepository.getAverageMarksByStudentId(s.getId());
            if (avgMarks != null) {
                s.setAverageMarks(Math.round(avgMarks * 10.0) / 10.0);
            }
            studentRepository.save(s);
        }

        logger.info("Database initialization verified successfully with {} students.", students.size());
    }
}
