package com.smart.student.controller;

import com.smart.student.ai.AiSearchService;
import com.smart.student.dto.ApiResponse;
import com.smart.student.dto.ai.AiSearchRequest;
import com.smart.student.dto.ai.AiSearchResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiSearchController {

    private final AiSearchService aiSearchService;

    public AiSearchController(AiSearchService aiSearchService) {
        this.aiSearchService = aiSearchService;
    }

    @PostMapping("/student-search")
    public ResponseEntity<ApiResponse<AiSearchResponse>> searchWithAi(@Valid @RequestBody AiSearchRequest request) {
        AiSearchResponse response = aiSearchService.searchStudentsByNaturalLanguage(request.getQuery());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
