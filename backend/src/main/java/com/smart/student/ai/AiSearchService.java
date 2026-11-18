package com.smart.student.ai;

import com.smart.student.dto.StudentDto;
import com.smart.student.dto.ai.AiSearchResponse;
import com.smart.student.dto.ai.StudentSearchCriteria;
import com.smart.student.entity.Student;
import com.smart.student.repository.StudentRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiSearchService {

    private static final Logger logger = LoggerFactory.getLogger(AiSearchService.class);

    private final LlmClient llmClient;
    private final StudentRepository studentRepository;

    public AiSearchService(LlmClient llmClient, StudentRepository studentRepository) {
        this.llmClient = llmClient;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public AiSearchResponse searchStudentsByNaturalLanguage(String query) {
        long startTime = System.currentTimeMillis();

        // 1. Interpret user query into structured search criteria
        StudentSearchCriteria criteria = llmClient.interpretQuery(query);
        criteria.validateAndSanitize();

        logger.info("AI interpreted query '{}' as criteria: {}", query, criteria.getExplanation());

        // 2. Build secure, parameterized JPA Specification
        Specification<Student> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Roll number exact / pattern match
            if (criteria.getRollNumber() != null && !criteria.getRollNumber().trim().isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("rollNumber")), criteria.getRollNumber().trim().toUpperCase()));
            }

            // Name query
            if (criteria.getNameQuery() != null && !criteria.getNameQuery().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + criteria.getNameQuery().trim().toLowerCase() + "%"));
            }

            // Email query
            if (criteria.getEmailQuery() != null && !criteria.getEmailQuery().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + criteria.getEmailQuery().trim().toLowerCase() + "%"));
            }

            // Department Code
            if (criteria.getDepartmentCode() != null && !criteria.getDepartmentCode().trim().isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("department").get("departmentCode")), criteria.getDepartmentCode().trim().toUpperCase()));
            }

            // Academic year / batch
            if (criteria.getAcademicYear() != null) {
                predicates.add(cb.equal(root.get("academicYear"), criteria.getAcademicYear()));
            }

            // Semester
            if (criteria.getSemester() != null) {
                predicates.add(cb.equal(root.get("semester"), criteria.getSemester()));
            }

            // Status
            if (criteria.getStatus() != null && !criteria.getStatus().trim().isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("status")), criteria.getStatus().trim().toUpperCase()));
            }

            // Attendance Range
            if (criteria.getMinAttendance() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendancePercentage"), criteria.getMinAttendance()));
            }
            if (criteria.getMaxAttendance() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendancePercentage"), criteria.getMaxAttendance()));
            }

            // Marks Range
            if (criteria.getMinMarks() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("averageMarks"), criteria.getMinMarks()));
            }
            if (criteria.getMaxMarks() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("averageMarks"), criteria.getMaxMarks()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 3. Configure Sorting
        Sort sort;
        String sortByField = "fullName";
        if (criteria.getSortBy() != null) {
            sortByField = switch (criteria.getSortBy().toLowerCase()) {
                case "marks" -> "averageMarks";
                case "attendance" -> "attendancePercentage";
                case "rollnumber" -> "rollNumber";
                case "admissiondate" -> "admissionDate";
                default -> "fullName";
            };
        }

        if ("DESC".equalsIgnoreCase(criteria.getSortDirection())) {
            sort = Sort.by(sortByField).descending();
        } else {
            sort = Sort.by(sortByField).ascending();
        }

        // 4. Configure Pagination / Top N limit
        int limit = (criteria.getTopN() != null && criteria.getTopN() > 0) ? criteria.getTopN() : 50;
        Pageable pageable = PageRequest.of(0, limit, sort);

        // 5. Execute secure parameterized query
        Page<Student> page = studentRepository.findAll(spec, pageable);
        List<StudentDto> dtoList = page.getContent().stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());

        long executionTime = System.currentTimeMillis() - startTime;

        String matchedRoll = criteria.getRollNumber();
        if (matchedRoll == null && dtoList.size() == 1) {
            matchedRoll = dtoList.get(0).getRollNumber();
        }

        return new AiSearchResponse(
                query,
                criteria,
                criteria.getExplanation(),
                matchedRoll,
                dtoList,
                llmClient.getActiveProviderName(),
                executionTime
        );
    }
}
