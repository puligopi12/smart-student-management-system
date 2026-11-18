package com.smart.student.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalDepartments;
    private long activeStudents;
    private long inactiveStudents;
    private double averageAttendance;
    private double averageAcademicPerformance;

    // Charts
    private List<Map<String, Object>> studentsByDepartment;
    private List<Map<String, Object>> studentsByAcademicYear;
    private List<Map<String, Object>> attendanceDistribution;
    private List<Map<String, Object>> performanceDistribution;
    private List<StudentDto> topPerformers;

    public DashboardStatsDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(long activeStudents) { this.activeStudents = activeStudents; }

    public long getInactiveStudents() { return inactiveStudents; }
    public void setInactiveStudents(long inactiveStudents) { this.inactiveStudents = inactiveStudents; }

    public double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(double averageAttendance) { this.averageAttendance = averageAttendance; }

    public double getAverageAcademicPerformance() { return averageAcademicPerformance; }
    public void setAverageAcademicPerformance(double averageAcademicPerformance) { this.averageAcademicPerformance = averageAcademicPerformance; }

    public List<Map<String, Object>> getStudentsByDepartment() { return studentsByDepartment; }
    public void setStudentsByDepartment(List<Map<String, Object>> studentsByDepartment) { this.studentsByDepartment = studentsByDepartment; }

    public List<Map<String, Object>> getStudentsByAcademicYear() { return studentsByAcademicYear; }
    public void setStudentsByAcademicYear(List<Map<String, Object>> studentsByAcademicYear) { this.studentsByAcademicYear = studentsByAcademicYear; }

    public List<Map<String, Object>> getAttendanceDistribution() { return attendanceDistribution; }
    public void setAttendanceDistribution(List<Map<String, Object>> attendanceDistribution) { this.attendanceDistribution = attendanceDistribution; }

    public List<Map<String, Object>> getPerformanceDistribution() { return performanceDistribution; }
    public void setPerformanceDistribution(List<Map<String, Object>> performanceDistribution) { this.performanceDistribution = performanceDistribution; }

    public List<StudentDto> getTopPerformers() { return topPerformers; }
    public void setTopPerformers(List<StudentDto> topPerformers) { this.topPerformers = topPerformers; }
}
