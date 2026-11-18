package com.smart.student.dto.ai;

import com.smart.student.dto.StudentDto;
import java.util.List;

public class AiSearchResponse {
    private String query;
    private StudentSearchCriteria criteria;
    private String explanation;
    private String matchedRollNumber;
    private int totalResults;
    private List<StudentDto> results;
    private String aiProvider;
    private long executionTimeMs;

    public AiSearchResponse() {}

    public AiSearchResponse(String query, StudentSearchCriteria criteria, String explanation, 
                            String matchedRollNumber, List<StudentDto> results, String aiProvider, long executionTimeMs) {
        this.query = query;
        this.criteria = criteria;
        this.explanation = explanation;
        this.matchedRollNumber = matchedRollNumber;
        this.results = results;
        this.totalResults = results != null ? results.size() : 0;
        this.aiProvider = aiProvider;
        this.executionTimeMs = executionTimeMs;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public StudentSearchCriteria getCriteria() { return criteria; }
    public void setCriteria(StudentSearchCriteria criteria) { this.criteria = criteria; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getMatchedRollNumber() { return matchedRollNumber; }
    public void setMatchedRollNumber(String matchedRollNumber) { this.matchedRollNumber = matchedRollNumber; }

    public int getTotalResults() { return totalResults; }
    public void setTotalResults(int totalResults) { this.totalResults = totalResults; }

    public List<StudentDto> getResults() { return results; }
    public void setResults(List<StudentDto> results) { 
        this.results = results; 
        this.totalResults = results != null ? results.size() : 0;
    }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
