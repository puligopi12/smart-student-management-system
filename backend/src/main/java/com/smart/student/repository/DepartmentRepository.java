package com.smart.student.repository;

import com.smart.student.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCodeIgnoreCase(String departmentCode);
    Optional<Department> findByDepartmentNameIgnoreCase(String departmentName);
    Boolean existsByDepartmentCodeIgnoreCase(String departmentCode);
}
