package com.smart.student.dto;

import com.smart.student.entity.Marks;
import java.time.LocalDate;

public class MarksDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Integer semester;
    private Double marksObtained;
    private Double maxMarks;
    private String grade;
    private String examType;
    private LocalDate examDate;

    public MarksDto() {}

    public static MarksDto fromEntity(Marks m) {
        if (m == null) return null;
        MarksDto dto = new MarksDto();
        dto.setId(m.getId());
        if (m.getStudent() != null) {
            dto.setStudentId(m.getStudent().getId());
            dto.setStudentName(m.getStudent().getFullName());
            dto.setRollNumber(m.getStudent().getRollNumber());
        }
        if (m.getSubject() != null) {
            dto.setSubjectId(m.getSubject().getId());
            dto.setSubjectName(m.getSubject().getSubjectName());
            dto.setSubjectCode(m.getSubject().getSubjectCode());
        }
        dto.setSemester(m.getSemester());
        dto.setMarksObtained(m.getMarksObtained());
        dto.setMaxMarks(m.getMaxMarks());
        dto.setGrade(m.getGrade());
        dto.setExamType(m.getExamType());
        dto.setExamDate(m.getExamDate());
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

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }
}
