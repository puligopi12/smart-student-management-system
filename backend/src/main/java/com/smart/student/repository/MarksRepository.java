package com.smart.student.repository;

import com.smart.student.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentIdOrderBySemesterAsc(Long studentId);

    List<Marks> findByStudentIdAndSemester(Long studentId, Integer semester);

    Optional<Marks> findByStudentIdAndSubjectIdAndSemesterAndExamType(Long studentId, Long subjectId, Integer semester, String examType);

    @Query("SELECT AVG(m.marksObtained) FROM Marks m WHERE m.student.id = :studentId")
    Double getAverageMarksByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT m.grade, COUNT(m) FROM Marks m GROUP BY m.grade")
    List<Object[]> countMarksByGrade();
}
