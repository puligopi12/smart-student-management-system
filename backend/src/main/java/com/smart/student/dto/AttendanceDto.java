package com.smart.student.dto;

import com.smart.student.entity.Attendance;
import java.time.LocalDate;

public class AttendanceDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private LocalDate attendanceDate;
    private String status;
    private String remarks;

    public AttendanceDto() {}

    public static AttendanceDto fromEntity(Attendance a) {
        if (a == null) return null;
        AttendanceDto dto = new AttendanceDto();
        dto.setId(a.getId());
        if (a.getStudent() != null) {
            dto.setStudentId(a.getStudent().getId());
            dto.setStudentName(a.getStudent().getFullName());
            dto.setRollNumber(a.getStudent().getRollNumber());
        }
        dto.setAttendanceDate(a.getAttendanceDate());
        dto.setStatus(a.getStatus());
        dto.setRemarks(a.getRemarks());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
