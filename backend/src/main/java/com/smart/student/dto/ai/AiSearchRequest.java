package com.smart.student.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiSearchRequest {

    @NotBlank(message = "Search query cannot be empty")
    @Size(max = 500, message = "Query cannot exceed 500 characters")
    private String query;

    public AiSearchRequest() {}

    public AiSearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
