package com.smart.student.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "semesters", uniqueConstraints = {
    @UniqueConstraint(name = "uq_sem_year", columnNames = {"semester_number", "academic_year"})
})
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(name = "semester_name", nullable = false, length = 50)
    private String semesterName;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    public Semester() {}

    public Semester(Integer semesterNumber, String semesterName, Integer academicYear) {
        this.semesterNumber = semesterNumber;
        this.semesterName = semesterName;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(Integer semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public Integer getAcademicYear() { return academicYear; }
    public void setAcademicYear(Integer academicYear) { this.academicYear = academicYear; }
}
