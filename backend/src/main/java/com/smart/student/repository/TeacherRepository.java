package com.smart.student.repository;

import com.smart.student.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmployeeIdIgnoreCase(String employeeId);
    Optional<Teacher> findByEmailIgnoreCase(String email);
    Optional<Teacher> findByUserId(Long userId);
    List<Teacher> findByDepartmentId(Long departmentId);
}
