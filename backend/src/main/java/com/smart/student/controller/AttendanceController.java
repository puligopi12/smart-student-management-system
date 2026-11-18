package com.smart.student.controller;

import com.smart.student.dto.ApiResponse;
import com.smart.student.dto.AttendanceDto;
import com.smart.student.dto.AttendanceMarkRequest;
import com.smart.student.dto.AttendanceSummaryDto;
import com.smart.student.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceDto>> markAttendance(
            @Valid @RequestBody AttendanceMarkRequest request,
            @RequestParam(required = false) Long teacherId) {
        AttendanceDto marked = attendanceService.markAttendance(request, teacherId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Attendance marked successfully", marked));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<AttendanceDto>>> markBatchAttendance(
            @Valid @RequestBody List<AttendanceMarkRequest> requests,
            @RequestParam(required = false) Long teacherId) {
        List<AttendanceDto> results = attendanceService.markBatchAttendance(requests, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Batch attendance recorded successfully", results));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getStudentAttendance(@PathVariable Long studentId) {
        AttendanceSummaryDto summary = attendanceService.getStudentAttendanceSummary(studentId);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/department")
    public ResponseEntity<ApiResponse<List<AttendanceDto>>> getDepartmentAttendance(
            @RequestParam Long departmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDto> attendanceList = attendanceService.getAttendanceByDepartmentAndDate(departmentId, date);
        return ResponseEntity.ok(ApiResponse.ok(attendanceList));
    }
}
