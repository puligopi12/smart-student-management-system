package com.smart.student.controller;

import com.smart.student.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.ok("Smart Student Management System API is UP and Healthy", Map.of(
                "status", "UP",
                "service", "student-management-backend",
                "version", "1.0.0",
                "timestamp", System.currentTimeMillis()
        )));
    }
}
