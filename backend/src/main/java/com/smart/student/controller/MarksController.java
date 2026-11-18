package com.smart.student.controller;

import com.smart.student.dto.ApiResponse;
import com.smart.student.dto.MarksDto;
import com.smart.student.dto.MarksEntryRequest;
import com.smart.student.dto.StudentDto;
import com.smart.student.dto.StudentResultDto;
import com.smart.student.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MarksDto>> addOrUpdateMarks(@Valid @RequestBody MarksEntryRequest request) {
        MarksDto result = marksService.addOrUpdateMarks(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Marks saved successfully", result));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<StudentResultDto>> getStudentMarks(
            @PathVariable Long studentId,
            @RequestParam(required = false) Integer semester) {
        StudentResultDto result = marksService.getStudentResults(studentId, semester);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/top-performers")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getTopPerformers() {
        List<StudentDto> topPerformers = marksService.getTopPerformers();
        return ResponseEntity.ok(ApiResponse.ok(topPerformers));
    }
}
