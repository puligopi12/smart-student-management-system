package com.smart.student.ai;

import com.smart.student.dto.ai.StudentSearchCriteria;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class NlpSearchParser {

    private static final Pattern ROLL_PATTERN = Pattern.compile("\\b(\\d{2}[A-Za-z]{2,5}\\d{2,4})\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");
    private static final Pattern TOP_N_PATTERN = Pattern.compile("\\btop\\s+(\\d+)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern ATTENDANCE_BELOW_PATTERN = Pattern.compile("attendance\\s+(?:below|under|less\\s+than|<)\\s*(\\d+(?:\\.\\d+)?)\\s*%?", Pattern.CASE_INSENSITIVE);
    private static final Pattern ATTENDANCE_ABOVE_PATTERN = Pattern.compile("attendance\\s+(?:above|over|more\\s+than|>|greater\\s+than)\\s*(\\d+(?:\\.\\d+)?)\\s*%?", Pattern.CASE_INSENSITIVE);
    private static final Pattern MARKS_ABOVE_PATTERN = Pattern.compile("(?:scored|marks|score)\\s+(?:more\\s+than|above|over|>|greater\\s+than)\\s*(\\d+(?:\\.\\d+)?)(?:\\s*marks)?", Pattern.CASE_INSENSITIVE);
    private static final Pattern MARKS_BELOW_PATTERN = Pattern.compile("(?:scored|marks|score)\\s+(?:less\\s+than|below|under|<)\\s*(\\d+(?:\\.\\d+)?)(?:\\s*marks)?", Pattern.CASE_INSENSITIVE);
    private static final Pattern BATCH_YEAR_PATTERN = Pattern.compile("(?:batch|year|from)\\s+(?:of\\s+)?(20\\d{2})|(20\\d{2})\\s+batch", Pattern.CASE_INSENSITIVE);
    private static final Pattern NAME_PATTERN = Pattern.compile("(?:named|name\\s+is|called|named\\s+as|student\\s+named)\\s+([A-Za-z]+)", Pattern.CASE_INSENSITIVE);

    public StudentSearchCriteria parse(String query) {
        if (query == null || query.trim().isEmpty()) {
            StudentSearchCriteria criteria = new StudentSearchCriteria();
            criteria.setExplanation("Showing all students");
            return criteria;
        }

        String q = query.trim();
        String lower = q.toLowerCase(Locale.ROOT);
        StudentSearchCriteria criteria = new StudentSearchCriteria();
        StringBuilder explanation = new StringBuilder();

        // 1. Roll Number Check (e.g. "Find student with roll number 22CS101")
        Matcher rollMatcher = ROLL_PATTERN.matcher(q);
        if (rollMatcher.find()) {
            String roll = rollMatcher.group(1).toUpperCase();
            criteria.setRollNumber(roll);
            criteria.setQueryType("ROLL_LOOKUP");
            explanation.append("Looking up student with exact roll number '").append(roll).append("'");
        }

        // 2. Email Address Check (e.g. "Find a student using their email address rahul.sharma@student.edu")
        Matcher emailMatcher = EMAIL_PATTERN.matcher(q);
        if (emailMatcher.find()) {
            String email = emailMatcher.group(1).toLowerCase();
            criteria.setEmailQuery(email);
            criteria.setQueryType("EMAIL_LOOKUP");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Filtering by email '").append(email).append("'");
        }

        // 3. Department Check (e.g. "Show all CSE department students", "belong to the ECE department")
        if (lower.contains("cse") || lower.contains("computer science")) {
            criteria.setDepartmentCode("CSE");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Department: Computer Science & Engineering (CSE)");
        } else if (lower.contains("ece") || lower.contains("electronics")) {
            criteria.setDepartmentCode("ECE");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Department: Electronics & Communication Engineering (ECE)");
        } else if (lower.contains("mech") || lower.contains("mechanical")) {
            criteria.setDepartmentCode("MECH");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Department: Mechanical Engineering (MECH)");
        } else if (lower.contains("civil")) {
            criteria.setDepartmentCode("CIVIL");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Department: Civil Engineering (CIVIL)");
        } else if (lower.contains("it") && !lower.contains("with") && !lower.contains("limit")) {
            // Check word boundary for IT
            if (q.matches("(?i).*\\bIT\\b.*") || lower.contains("information tech")) {
                criteria.setDepartmentCode("IT");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Department: Information Technology (IT)");
            }
        }

        // 4. Batch / Academic Year Check (e.g. "Find students from the 2025 batch")
        Matcher batchMatcher = BATCH_YEAR_PATTERN.matcher(q);
        if (batchMatcher.find()) {
            String yearStr = batchMatcher.group(1) != null ? batchMatcher.group(1) : batchMatcher.group(2);
            int year = Integer.parseInt(yearStr);
            criteria.setAcademicYear(year);
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Batch year: ").append(year);
        }

        // 5. Attendance below / above check (e.g. "Show students with attendance below 75%")
        Matcher attBelowMatcher = ATTENDANCE_BELOW_PATTERN.matcher(q);
        if (attBelowMatcher.find()) {
            double maxAtt = Double.parseDouble(attBelowMatcher.group(1));
            criteria.setMaxAttendance(maxAtt);
            criteria.setQueryType("ATTENDANCE_FILTER");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Attendance below ").append(maxAtt).append("%");
        }

        Matcher attAboveMatcher = ATTENDANCE_ABOVE_PATTERN.matcher(q);
        if (attAboveMatcher.find()) {
            double minAtt = Double.parseDouble(attAboveMatcher.group(1));
            criteria.setMinAttendance(minAtt);
            criteria.setQueryType("ATTENDANCE_FILTER");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Attendance above ").append(minAtt).append("%");
        }

        // 6. Marks above / below check (e.g. "Find students who scored more than 80 marks")
        Matcher marksAboveMatcher = MARKS_ABOVE_PATTERN.matcher(q);
        if (marksAboveMatcher.find()) {
            double minMarks = Double.parseDouble(marksAboveMatcher.group(1));
            criteria.setMinMarks(minMarks);
            criteria.setQueryType("MARKS_FILTER");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Academic marks > ").append(minMarks);
        }

        Matcher marksBelowMatcher = MARKS_BELOW_PATTERN.matcher(q);
        if (marksBelowMatcher.find()) {
            double maxMarks = Double.parseDouble(marksBelowMatcher.group(1));
            criteria.setMaxMarks(maxMarks);
            criteria.setQueryType("MARKS_FILTER");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Academic marks < ").append(maxMarks);
        }

        // 7. Top N Check (e.g. "Show the top 10 students based on marks", "top 5 students")
        Matcher topNMatcher = TOP_N_PATTERN.matcher(q);
        if (topNMatcher.find()) {
            int topN = Integer.parseInt(topNMatcher.group(1));
            criteria.setTopN(topN);
            criteria.setSortBy("marks");
            criteria.setSortDirection("DESC");
            criteria.setQueryType("TOP_N");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Top ").append(topN).append(" students ranked by marks");
        }

        // 8. Name Check (e.g. "Search for students named Rahul", "Find Rahul")
        Matcher nameMatcher = NAME_PATTERN.matcher(q);
        if (nameMatcher.find()) {
            String name = nameMatcher.group(1);
            criteria.setNameQuery(name);
            criteria.setQueryType("NAME_SEARCH");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Student name containing '").append(name).append("'");
        } else if (criteria.getRollNumber() == null && criteria.getEmailQuery() == null) {
            // Check direct name queries like "Rahul" or "Sneha"
            String cleaned = lower.replaceAll("(?i)\\b(search|find|for|students|student|show|all|list|who|are)\\b", "").trim();
            if (!cleaned.isEmpty() && cleaned.length() >= 3 && !cleaned.contains("department") && !cleaned.contains("attendance") && !cleaned.contains("marks") && !cleaned.contains("batch") && !cleaned.contains("sort")) {
                criteria.setNameQuery(cleaned);
                criteria.setQueryType("NAME_SEARCH");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Searching for student name matching '").append(cleaned).append("'");
            }
        }

        // 9. Sorting Check (e.g. "Sort students by name alphabetically", "sort by marks", "sort by attendance")
        if (lower.contains("sort") || lower.contains("alphabetically") || lower.contains("order by")) {
            if (lower.contains("name") || lower.contains("alphabetically")) {
                criteria.setSortBy("name");
                criteria.setSortDirection(lower.contains("desc") ? "DESC" : "ASC");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Sorted alphabetically by student name");
            } else if (lower.contains("mark") || lower.contains("score")) {
                criteria.setSortBy("marks");
                criteria.setSortDirection(lower.contains("asc") ? "ASC" : "DESC");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Sorted by marks");
            } else if (lower.contains("attendance")) {
                criteria.setSortBy("attendance");
                criteria.setSortDirection(lower.contains("asc") ? "ASC" : "DESC");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Sorted by attendance percentage");
            } else if (lower.contains("roll")) {
                criteria.setSortBy("rollnumber");
                criteria.setSortDirection("ASC");
                if (explanation.length() > 0) explanation.append("; ");
                explanation.append("Sorted by roll number");
            }
        }

        // 10. Status check
        if (lower.contains("inactive")) {
            criteria.setStatus("INACTIVE");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Status: INACTIVE");
        } else if (lower.contains("active") && !lower.contains("interactive")) {
            criteria.setStatus("ACTIVE");
            if (explanation.length() > 0) explanation.append("; ");
            explanation.append("Status: ACTIVE");
        }

        if (explanation.length() == 0) {
            explanation.append("Showing all student records");
        }

        criteria.setExplanation(explanation.toString());
        criteria.validateAndSanitize();
        return criteria;
    }
}
