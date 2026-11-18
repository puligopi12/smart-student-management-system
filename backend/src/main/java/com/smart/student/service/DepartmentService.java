package com.smart.student.service;

import com.smart.student.dto.CourseDto;
import com.smart.student.dto.DepartmentDto;
import com.smart.student.entity.Course;
import com.smart.student.entity.Department;
import com.smart.student.exception.DuplicateResourceException;
import com.smart.student.exception.ResourceNotFoundException;
import com.smart.student.repository.CourseRepository;
import com.smart.student.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;

    public DepartmentService(DepartmentRepository departmentRepository, CourseRepository courseRepository) {
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return DepartmentDto.fromEntity(dept);
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByDepartment(Long departmentId) {
        return courseRepository.findByDepartmentId(departmentId).stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByDepartmentCodeIgnoreCase(dto.getDepartmentCode())) {
            throw new DuplicateResourceException("Department code already exists: " + dto.getDepartmentCode());
        }
        Department dept = new Department(dto.getDepartmentName(), dto.getDepartmentCode(), dto.getDescription());
        return DepartmentDto.fromEntity(departmentRepository.save(dept));
    }
}
