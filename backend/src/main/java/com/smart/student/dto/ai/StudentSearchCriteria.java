package com.smart.student.dto.ai;

public class StudentSearchCriteria {
    private String rollNumber;
    private String nameQuery;
    private String emailQuery;
    private String departmentCode;
    private Integer academicYear;
    private Integer semester;
    private String status;
    private Double minAttendance;
    private Double maxAttendance;
    private Double minMarks;
    private Double maxMarks;
    private Integer topN;
    private String sortBy; // "name", "rollNumber", "marks", "attendance", "admissionDate"
    private String sortDirection = "ASC"; // "ASC" or "DESC"
    private String explanation;
    private String queryType = "GENERAL";

    public StudentSearchCriteria() {}

    // Validation helper
    public void validateAndSanitize() {
        if (topN != null && topN > 100) {
            topN = 100;
        }
        if (sortDirection != null && !sortDirection.equalsIgnoreCase("DESC")) {
            sortDirection = "ASC";
        }
        if (sortBy != null) {
            sortBy = sortBy.trim().toLowerCase();
            if (!List.of("name", "rollnumber", "marks", "attendance", "admissiondate").contains(sortBy)) {
                sortBy = "name";
            }
        }
    }

    private static class List {
        static java.util.List<String> of(String... items) {
            return java.util.Arrays.asList(items);
        }
    }

    // Getters and Setters
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getNameQuery() { return nameQuery; }
    public void setNameQuery(String nameQuery) { this.nameQuery = nameQuery; }

    public String getEmailQuery() { return emailQuery; }
    public void setEmailQuery(String emailQuery) { this.emailQuery = emailQuery; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public Integer getAcademicYear() { return academicYear; }
    public void setAcademicYear(Integer academicYear) { this.academicYear = academicYear; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getMinAttendance() { return minAttendance; }
    public void setMinAttendance(Double minAttendance) { this.minAttendance = minAttendance; }

    public Double getMaxAttendance() { return maxAttendance; }
    public void setMaxAttendance(Double maxAttendance) { this.maxAttendance = maxAttendance; }

    public Double getMinMarks() { return minMarks; }
    public void setMinMarks(Double minMarks) { this.minMarks = minMarks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    public Integer getTopN() { return topN; }
    public void setTopN(Integer topN) { this.topN = topN; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getQueryType() { return queryType; }
    public void setQueryType(String queryType) { this.queryType = queryType; }
}
