package com.smart.student.service;

import com.smart.student.dto.DashboardStatsDto;
import com.smart.student.dto.StudentDto;
import com.smart.student.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final MarksRepository marksRepository;

    public DashboardService(StudentRepository studentRepository,
                            TeacherRepository teacherRepository,
                            DepartmentRepository departmentRepository,
                            MarksRepository marksRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.departmentRepository = departmentRepository;
        this.marksRepository = marksRepository;
    }

    public DashboardStatsDto getDashboardStatistics() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalDepartments = departmentRepository.count();
        long activeStudents = studentRepository.countByStatusIgnoreCase("ACTIVE");
        long inactiveStudents = totalStudents - activeStudents;

        Double avgAtt = studentRepository.getAverageAttendance();
        Double avgMarks = studentRepository.getAverageMarks();

        stats.setTotalStudents(totalStudents);
        stats.setTotalTeachers(totalTeachers);
        stats.setTotalDepartments(totalDepartments);
        stats.setActiveStudents(activeStudents);
        stats.setInactiveStudents(inactiveStudents);
        stats.setAverageAttendance(avgAtt != null ? Math.round(avgAtt * 10.0) / 10.0 : 0.0);
        stats.setAverageAcademicPerformance(avgMarks != null ? Math.round(avgMarks * 10.0) / 10.0 : 0.0);

        // 1. Students by department
        List<Object[]> deptCounts = studentRepository.countStudentsByDepartment();
        List<Map<String, Object>> deptList = new ArrayList<>();
        for (Object[] row : deptCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("departmentName", row[0]);
            map.put("departmentCode", row[1]);
            map.put("count", row[2]);
            deptList.add(map);
        }
        stats.setStudentsByDepartment(deptList);

        // 2. Students by academic year
        List<Object[]> yearCounts = studentRepository.countStudentsByAcademicYear();
        List<Map<String, Object>> yearList = new ArrayList<>();
        for (Object[] row : yearCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("year", String.valueOf(row[0]));
            map.put("count", row[1]);
            yearList.add(map);
        }
        stats.setStudentsByAcademicYear(yearList);

        // 3. Attendance distribution
        List<com.smart.student.entity.Student> allStudents = studentRepository.findAll();
        long below75 = allStudents.stream().filter(s -> s.getAttendancePercentage() != null && s.getAttendancePercentage() < 75.0).count();
        long between75and85 = allStudents.stream().filter(s -> s.getAttendancePercentage() != null && s.getAttendancePercentage() >= 75.0 && s.getAttendancePercentage() < 85.0).count();
        long above85 = allStudents.stream().filter(s -> s.getAttendancePercentage() != null && s.getAttendancePercentage() >= 85.0).count();

        List<Map<String, Object>> attDist = List.of(
                Map.of("category", "< 75% (Critical)", "count", below75, "color", "#ef4444"),
                Map.of("category", "75% - 85% (Average)", "count", between75and85, "color", "#f59e0b"),
                Map.of("category", "> 85% (Good)", "count", above85, "color", "#10b981")
        );
        stats.setAttendanceDistribution(attDist);

        // 4. Performance Grade distribution
        List<Object[]> gradeCounts = marksRepository.countMarksByGrade();
        List<Map<String, Object>> gradeList = new ArrayList<>();
        for (Object[] row : gradeCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("grade", String.valueOf(row[0]));
            map.put("count", row[1]);
            gradeList.add(map);
        }
        stats.setPerformanceDistribution(gradeList);

        // 5. Top 5 performers
        List<StudentDto> top5 = studentRepository.findTopPerformers().stream()
                .limit(5)
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
        stats.setTopPerformers(top5);

        return stats;
    }
}
