package com.smart.student.service;

import com.smart.student.dto.MarksDto;
import com.smart.student.dto.MarksEntryRequest;
import com.smart.student.dto.StudentDto;
import com.smart.student.dto.StudentResultDto;
import com.smart.student.entity.Marks;
import com.smart.student.entity.Student;
import com.smart.student.entity.Subject;
import com.smart.student.exception.ResourceNotFoundException;
import com.smart.student.repository.MarksRepository;
import com.smart.student.repository.StudentRepository;
import com.smart.student.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final StudentService studentService;

    public MarksService(MarksRepository marksRepository,
                        StudentRepository studentRepository,
                        SubjectRepository subjectRepository,
                        StudentService studentService) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.studentService = studentService;
    }

    @Transactional
    public MarksDto addOrUpdateMarks(MarksEntryRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + req.getStudentId()));

        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + req.getSubjectId()));

        double maxMarks = req.getMaxMarks() != null && req.getMaxMarks() > 0 ? req.getMaxMarks() : subject.getMaxMarks();
        double pct = (req.getMarksObtained() / maxMarks) * 100.0;
        String grade = Marks.calculateGrade(pct);

        String examType = req.getExamType() != null ? req.getExamType().trim().toUpperCase() : "FINAL";

        Optional<Marks> existing = marksRepository.findByStudentIdAndSubjectIdAndSemesterAndExamType(
                student.getId(), subject.getId(), req.getSemester(), examType);

        Marks marks;
        if (existing.isPresent()) {
            marks = existing.get();
            marks.setMarksObtained(req.getMarksObtained());
            marks.setMaxMarks(maxMarks);
            marks.setGrade(grade);
            marks.setExamDate(req.getExamDate());
        } else {
            marks = new Marks(student, subject, req.getSemester(), req.getMarksObtained(), maxMarks, grade, examType, req.getExamDate());
        }

        Marks saved = marksRepository.save(marks);

        // Update student average marks
        studentService.recalculateStudentMetrics(student.getId());

        return MarksDto.fromEntity(saved);
    }

    public StudentResultDto getStudentResults(Long studentId, Integer semester) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<Marks> marksList;
        if (semester != null) {
            marksList = marksRepository.findByStudentIdAndSemester(studentId, semester);
        } else {
            marksList = marksRepository.findByStudentIdOrderBySemesterAsc(studentId);
        }

        double totalObtained = marksList.stream().mapToDouble(Marks::getMarksObtained).sum();
        double totalMax = marksList.stream().mapToDouble(Marks::getMaxMarks).sum();
        double overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100.0 : 0.0;

        StudentResultDto result = new StudentResultDto();
        result.setStudentId(student.getId());
        result.setStudentName(student.getFullName());
        result.setRollNumber(student.getRollNumber());
        result.setDepartmentName(student.getDepartment().getDepartmentName());
        result.setSemester(semester != null ? semester : student.getSemester());
        result.setTotalMarksObtained(Math.round(totalObtained * 10.0) / 10.0);
        result.setTotalMaxMarks(totalMax);
        result.setOverallPercentage(Math.round(overallPct * 10.0) / 10.0);
        result.setOverallGrade(Marks.calculateGrade(overallPct));
        result.setSubjectMarks(marksList.stream().map(MarksDto::fromEntity).collect(Collectors.toList()));

        return result;
    }

    public List<StudentDto> getTopPerformers() {
        return studentRepository.findTopPerformers().stream()
                .limit(10)
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }
}
