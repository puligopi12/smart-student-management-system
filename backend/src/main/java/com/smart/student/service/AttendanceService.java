package com.smart.student.service;

import com.smart.student.dto.AttendanceDto;
import com.smart.student.dto.AttendanceMarkRequest;
import com.smart.student.dto.AttendanceSummaryDto;
import com.smart.student.entity.Attendance;
import com.smart.student.entity.Student;
import com.smart.student.entity.Teacher;
import com.smart.student.exception.ResourceNotFoundException;
import com.smart.student.repository.AttendanceRepository;
import com.smart.student.repository.StudentRepository;
import com.smart.student.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentService studentService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             TeacherRepository teacherRepository,
                             StudentService studentService) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.studentService = studentService;
    }

    @Transactional
    public AttendanceDto markAttendance(AttendanceMarkRequest req, Long teacherId) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + req.getStudentId()));

        Teacher teacher = null;
        if (teacherId != null) {
            teacher = teacherRepository.findById(teacherId).orElse(null);
        }

        // Check if attendance already exists for this date
        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), req.getAttendanceDate());
        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(req.getStatus().trim().toUpperCase());
            attendance.setRemarks(req.getRemarks());
            if (teacher != null) {
                attendance.setMarkedByTeacher(teacher);
            }
        } else {
            attendance = new Attendance(student, req.getAttendanceDate(), req.getStatus().trim().toUpperCase(), req.getRemarks(), teacher);
        }

        Attendance saved = attendanceRepository.save(attendance);

        // Update student attendance metric
        studentService.recalculateStudentMetrics(student.getId());

        return AttendanceDto.fromEntity(saved);
    }

    @Transactional
    public List<AttendanceDto> markBatchAttendance(List<AttendanceMarkRequest> requests, Long teacherId) {
        return requests.stream()
                .map(req -> markAttendance(req, teacherId))
                .collect(Collectors.toList());
    }

    public AttendanceSummaryDto getStudentAttendanceSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<Attendance> records = attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(studentId);
        long total = records.size();
        long present = records.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count();
        long absent = total - present;
        double pct = total > 0 ? (double) present / total * 100.0 : 100.0;

        AttendanceSummaryDto summary = new AttendanceSummaryDto();
        summary.setStudentId(student.getId());
        summary.setStudentName(student.getFullName());
        summary.setRollNumber(student.getRollNumber());
        summary.setTotalClasses(total);
        summary.setPresentCount(present);
        summary.setAbsentCount(absent);
        summary.setAttendancePercentage(Math.round(pct * 10.0) / 10.0);
        summary.setRecentRecords(records.stream().limit(30).map(AttendanceDto::fromEntity).collect(Collectors.toList()));

        return summary;
    }

    public List<AttendanceDto> getAttendanceByDepartmentAndDate(Long departmentId, LocalDate date) {
        return attendanceRepository.findByDepartmentAndDate(departmentId, date).stream()
                .map(AttendanceDto::fromEntity)
                .collect(Collectors.toList());
    }
}
