package com.smart.student.controller;

import com.smart.student.dto.ApiResponse;
import com.smart.student.dto.CourseDto;
import com.smart.student.dto.DepartmentDto;
import com.smart.student.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.ok(departments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable Long id) {
        DepartmentDto department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(department));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@Valid @RequestBody DepartmentDto dto) {
        DepartmentDto created = departmentService.createDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Department created successfully", created));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses() {
        List<CourseDto> courses = departmentService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    @GetMapping("/{id}/courses")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getCoursesByDepartment(@PathVariable Long id) {
        List<CourseDto> courses = departmentService.getCoursesByDepartment(id);
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }
}
