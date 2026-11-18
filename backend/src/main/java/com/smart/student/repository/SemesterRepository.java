package com.smart.student.repository;

import com.smart.student.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    Optional<Semester> findBySemesterNumberAndAcademicYear(Integer semesterNumber, Integer academicYear);
    List<Semester> findByAcademicYearOrderBySemesterNumberAsc(Integer academicYear);
}
