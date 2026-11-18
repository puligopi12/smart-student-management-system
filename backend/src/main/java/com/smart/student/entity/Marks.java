package com.smart.student.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks", uniqueConstraints = {
    @UniqueConstraint(name = "uq_student_subject_exam", columnNames = {"student_id", "subject_id", "semester", "exam_type"})
})
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks = 100.0;

    @Column(nullable = false, length = 10)
    private String grade; // O, A+, A, B+, B, C, P, F

    @Column(name = "exam_type", length = 50)
    private String examType = "FINAL"; // INTERNAL, MIDTERM, FINAL

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Marks() {}

    public Marks(Student student, Subject subject, Integer semester, Double marksObtained, Double maxMarks, String grade, String examType, LocalDate examDate) {
        this.student = student;
        this.subject = subject;
        this.semester = semester;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks != null ? maxMarks : 100.0;
        this.grade = grade;
        this.examType = examType != null ? examType : "FINAL";
        this.examDate = examDate;
    }

    public static String calculateGrade(double percentage) {
        if (percentage >= 90.0) return "O";
        if (percentage >= 80.0) return "A+";
        if (percentage >= 70.0) return "A";
        if (percentage >= 60.0) return "B+";
        if (percentage >= 50.0) return "B";
        if (percentage >= 40.0) return "C";
        return "F";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
