package com.smart.student.repository;

import com.smart.student.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);

    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate attendanceDate);

    @Query("SELECT a FROM Attendance a WHERE a.student.department.id = :departmentId AND a.attendanceDate = :date")
    List<Attendance> findByDepartmentAndDate(@Param("departmentId") Long departmentId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a.status, COUNT(a) FROM Attendance a GROUP BY a.status")
    List<Object[]> countAttendanceByStatus();

    List<Attendance> findByAttendanceDate(LocalDate date);
}
