package com.smart.student.controller;

import com.smart.student.dto.*;
import com.smart.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StudentDto>>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Integer academicYear,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minAttendance,
            @RequestParam(required = false) Double maxAttendance,
            @RequestParam(required = false) Double minMarks,
            @RequestParam(required = false) Double maxMarks) {

        PageResponse<StudentDto> result = studentService.getStudents(
                page, size, sortBy, sortDir, search, departmentId, academicYear,
                semester, status, minAttendance, maxAttendance, minMarks, maxMarks);

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.ok(student));
    }

    @GetMapping("/roll-number/{rollNumber}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentByRollNumber(@PathVariable String rollNumber) {
        StudentDto student = studentService.getStudentByRollNumber(rollNumber);
        return ResponseEntity.ok(ApiResponse.ok(student));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<StudentDto>>> searchStudents(
            @RequestParam(required = false) String rollNumber,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        String searchTerm = rollNumber != null ? rollNumber : (name != null ? name : email);
        PageResponse<StudentDto> result = studentService.getStudents(
                page, size, sortBy, sortDir, searchTerm, departmentId, null, null, null, null, null, null, null);

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        StudentDto created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Student registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest request) {
        StudentDto updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted successfully", null));
    }
}
