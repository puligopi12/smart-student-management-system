package com.smart.student.service;

import com.smart.student.dto.PageResponse;
import com.smart.student.dto.StudentCreateRequest;
import com.smart.student.dto.StudentDto;
import com.smart.student.dto.StudentUpdateRequest;
import com.smart.student.entity.Course;
import com.smart.student.entity.Department;
import com.smart.student.entity.Student;
import com.smart.student.exception.DuplicateResourceException;
import com.smart.student.exception.ResourceNotFoundException;
import com.smart.student.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    public StudentService(StudentRepository studentRepository,
                          DepartmentRepository departmentRepository,
                          CourseRepository courseRepository,
                          AttendanceRepository attendanceRepository,
                          MarksRepository marksRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
    }

    public PageResponse<StudentDto> getStudents(int page, int size, String sortBy, String sortDir,
                                               String search, Long departmentId, Integer academicYear,
                                               Integer semester, String status, Double minAttendance,
                                               Double maxAttendance, Double minMarks, Double maxMarks) {
        // Map sort field safely
        String sortProperty = switch (sortBy != null ? sortBy.toLowerCase() : "id") {
            case "name", "fullname" -> "fullName";
            case "rollnumber", "roll" -> "rollNumber";
            case "attendance", "attendancepercentage" -> "attendancePercentage";
            case "marks", "averagemarks" -> "averageMarks";
            case "admissiondate" -> "admissionDate";
            case "year", "academicyear" -> "academicYear";
            default -> "id";
        };

        Sort sort = "desc".equalsIgnoreCase(sortDir) ?
                Sort.by(sortProperty).descending() :
                Sort.by(sortProperty).ascending();

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate rollMatch = cb.like(cb.lower(root.get("rollNumber")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), searchPattern);
                predicates.add(cb.or(nameMatch, rollMatch, emailMatch));
            }

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (academicYear != null) {
                predicates.add(cb.equal(root.get("academicYear"), academicYear));
            }

            if (semester != null) {
                predicates.add(cb.equal(root.get("semester"), semester));
            }

            if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(cb.upper(root.get("status")), status.trim().toUpperCase()));
            }

            if (minAttendance != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendancePercentage"), minAttendance));
            }

            if (maxAttendance != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendancePercentage"), maxAttendance));
            }

            if (minMarks != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("averageMarks"), minMarks));
            }

            if (maxMarks != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("averageMarks"), maxMarks));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Student> studentPage = studentRepository.findAll(spec, pageable);
        return PageResponse.of(studentPage.map(StudentDto::fromEntity));
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return StudentDto.fromEntity(student);
    }

    public StudentDto getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumberIgnoreCase(rollNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with roll number: " + rollNumber));
        return StudentDto.fromEntity(student);
    }

    @Transactional
    public StudentDto createStudent(StudentCreateRequest req) {
        // Roll number uniqueness
        if (studentRepository.existsByRollNumberIgnoreCase(req.getRollNumber().trim())) {
            throw new DuplicateResourceException("Roll number '" + req.getRollNumber().trim() + "' is already registered to another student");
        }

        // Email uniqueness
        if (studentRepository.existsByEmailIgnoreCase(req.getEmail().trim())) {
            throw new DuplicateResourceException("Email '" + req.getEmail().trim() + "' is already in use");
        }

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + req.getDepartmentId()));

        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + req.getCourseId()));

        Student student = new Student(
                req.getFullName().trim(),
                req.getRollNumber().trim().toUpperCase(),
                req.getEmail().trim().toLowerCase(),
                req.getPhoneNumber().trim(),
                req.getGender().trim(),
                req.getDateOfBirth(),
                req.getAddress().trim(),
                department,
                course,
                req.getAcademicYear(),
                req.getSemester(),
                req.getAdmissionDate(),
                req.getStatus() != null ? req.getStatus().trim().toUpperCase() : "ACTIVE"
        );

        student.setAttendancePercentage(100.0);
        student.setAverageMarks(0.0);

        Student saved = studentRepository.save(student);
        return StudentDto.fromEntity(saved);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentUpdateRequest req) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // If email changed, check uniqueness
        if (!student.getEmail().equalsIgnoreCase(req.getEmail().trim()) &&
                studentRepository.existsByEmailIgnoreCase(req.getEmail().trim())) {
            throw new DuplicateResourceException("Email '" + req.getEmail().trim() + "' is already in use");
        }

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + req.getDepartmentId()));

        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + req.getCourseId()));

        student.setFullName(req.getFullName().trim());
        student.setEmail(req.getEmail().trim().toLowerCase());
        student.setPhoneNumber(req.getPhoneNumber().trim());
        student.setGender(req.getGender().trim());
        student.setDateOfBirth(req.getDateOfBirth());
        student.setAddress(req.getAddress().trim());
        student.setDepartment(department);
        student.setCourse(course);
        student.setAcademicYear(req.getAcademicYear());
        student.setSemester(req.getSemester());
        student.setAdmissionDate(req.getAdmissionDate());
        student.setStatus(req.getStatus().trim().toUpperCase());

        Student updated = studentRepository.save(student);
        return StudentDto.fromEntity(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    @Transactional
    public void recalculateStudentMetrics(Long studentId) {
        studentRepository.findById(studentId).ifPresent(student -> {
            long total = attendanceRepository.countTotalByStudentId(studentId);
            if (total > 0) {
                long present = attendanceRepository.countPresentByStudentId(studentId);
                double pct = (double) present / total * 100.0;
                student.setAttendancePercentage(Math.round(pct * 10.0) / 10.0);
            }
            Double avgMarks = marksRepository.getAverageMarksByStudentId(studentId);
            if (avgMarks != null) {
                student.setAverageMarks(Math.round(avgMarks * 10.0) / 10.0);
            }
            studentRepository.save(student);
        });
    }
}
