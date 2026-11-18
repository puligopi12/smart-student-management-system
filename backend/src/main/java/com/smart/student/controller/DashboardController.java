package com.smart.student.controller;

import com.smart.student.dto.ApiResponse;
import com.smart.student.dto.DashboardStatsDto;
import com.smart.student.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStatistics() {
        DashboardStatsDto stats = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
