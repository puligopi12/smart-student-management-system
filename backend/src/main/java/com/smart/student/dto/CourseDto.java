package com.smart.student.dto;

import com.smart.student.entity.Course;

public class CourseDto {
    private Long id;
    private String courseName;
    private String courseCode;
    private Long departmentId;
    private String departmentName;
    private Integer totalCredits;
    private Integer totalSemesters;

    public CourseDto() {}

    public static CourseDto fromEntity(Course c) {
        if (c == null) return null;
        CourseDto dto = new CourseDto();
        dto.setId(c.getId());
        dto.setCourseName(c.getCourseName());
        dto.setCourseCode(c.getCourseCode());
        if (c.getDepartment() != null) {
            dto.setDepartmentId(c.getDepartment().getId());
            dto.setDepartmentName(c.getDepartment().getDepartmentName());
        }
        dto.setTotalCredits(c.getTotalCredits());
        dto.setTotalSemesters(c.getTotalSemesters());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }

    public Integer getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(Integer totalSemesters) { this.totalSemesters = totalSemesters; }
}
