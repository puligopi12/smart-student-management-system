package com.smart.student.dto;

import java.util.List;

public class StudentResultDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;
    private Integer semester;
    private double totalMarksObtained;
    private double totalMaxMarks;
    private double overallPercentage;
    private String overallGrade;
    private List<MarksDto> subjectMarks;

    public StudentResultDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public double getTotalMarksObtained() { return totalMarksObtained; }
    public void setTotalMarksObtained(double totalMarksObtained) { this.totalMarksObtained = totalMarksObtained; }

    public double getTotalMaxMarks() { return totalMaxMarks; }
    public void setTotalMaxMarks(double totalMaxMarks) { this.totalMaxMarks = totalMaxMarks; }

    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }

    public String getOverallGrade() { return overallGrade; }
    public void setOverallGrade(String overallGrade) { this.overallGrade = overallGrade; }

    public List<MarksDto> getSubjectMarks() { return subjectMarks; }
    public void setSubjectMarks(List<MarksDto> subjectMarks) { this.subjectMarks = subjectMarks; }
}
