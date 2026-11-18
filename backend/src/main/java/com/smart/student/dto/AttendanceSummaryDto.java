package com.smart.student.dto;

import java.util.List;

public class AttendanceSummaryDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private double attendancePercentage;
    private List<AttendanceDto> recentRecords;

    public AttendanceSummaryDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }

    public long getPresentCount() { return presentCount; }
    public void setPresentCount(long presentCount) { this.presentCount = presentCount; }

    public long getAbsentCount() { return absentCount; }
    public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public List<AttendanceDto> getRecentRecords() { return recentRecords; }
    public void setRecentRecords(List<AttendanceDto> recentRecords) { this.recentRecords = recentRecords; }
}
