package com.smart.student.repository;

import com.smart.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    Optional<Student> findByRollNumberIgnoreCase(String rollNumber);

    Optional<Student> findByEmailIgnoreCase(String email);

    Boolean existsByRollNumberIgnoreCase(String rollNumber);

    Boolean existsByEmailIgnoreCase(String email);

    Optional<Student> findByUserId(Long userId);

    List<Student> findByDepartmentId(Long departmentId);

    long countByStatusIgnoreCase(String status);

    @Query("SELECT AVG(s.attendancePercentage) FROM Student s WHERE s.status = 'ACTIVE'")
    Double getAverageAttendance();

    @Query("SELECT AVG(s.averageMarks) FROM Student s WHERE s.status = 'ACTIVE'")
    Double getAverageMarks();

    @Query("SELECT s.department.departmentName, s.department.departmentCode, COUNT(s) FROM Student s GROUP BY s.department.id, s.department.departmentName, s.department.departmentCode")
    List<Object[]> countStudentsByDepartment();

    @Query("SELECT s.academicYear, COUNT(s) FROM Student s GROUP BY s.academicYear ORDER BY s.academicYear")
    List<Object[]> countStudentsByAcademicYear();

    @Query("SELECT s FROM Student s ORDER BY s.averageMarks DESC")
    List<Student> findTopPerformers();
}
