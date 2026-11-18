package com.smart.student.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smart.student.dto.ai.StudentSearchCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LlmClient {

    private static final Logger logger = LoggerFactory.getLogger(LlmClient.class);

    @Value("${app.ai.provider:gemini}")
    private String provider;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.model:gemini-1.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate;
    private final NlpSearchParser nlpParser;
    private final ObjectMapper objectMapper;

    public LlmClient(RestTemplate restTemplate, NlpSearchParser nlpParser) {
        this.restTemplate = restTemplate;
        this.nlpParser = nlpParser;
        this.objectMapper = new ObjectMapper();
    }

    public StudentSearchCriteria interpretQuery(String naturalLanguageQuery) {
        // If API key is not configured, seamlessly use the internal NLP parser
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equalsIgnoreCase("none")) {
            logger.info("Using built-in heuristic NLP parsing engine (no external API key provided).");
            return nlpParser.parse(naturalLanguageQuery);
        }

        try {
            if ("openai".equalsIgnoreCase(provider)) {
                return callOpenAi(naturalLanguageQuery);
            } else {
                return callGemini(naturalLanguageQuery);
            }
        } catch (Exception ex) {
            logger.warn("External LLM API call failed or timed out ({}). Falling back to internal NLP engine.", ex.getMessage());
            return nlpParser.parse(naturalLanguageQuery);
        }
    }

    public String getActiveProviderName() {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equalsIgnoreCase("none")) {
            return "internal-nlp-engine";
        }
        return provider.toLowerCase();
    }

    private StudentSearchCriteria callGemini(String query) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey.trim();

        String systemInstruction = """
            You are a Student Database Search Criteria Extractor.
            You must translate normal English queries into a JSON object with this EXACT schema:
            {
               "rollNumber": string or null (e.g. "22CS101"),
               "nameQuery": string or null (e.g. "Rahul"),
               "emailQuery": string or null,
               "departmentCode": string or null ("CSE", "ECE", "MECH", "CIVIL", "IT"),
               "academicYear": integer or null (e.g. 2025),
               "semester": integer or null,
               "status": string or null ("ACTIVE", "INACTIVE"),
               "minAttendance": number or null (e.g. 75.0),
               "maxAttendance": number or null (e.g. 75.0 for below 75%),
               "minMarks": number or null (e.g. 80.0 for more than 80 marks),
               "maxMarks": number or null,
               "topN": integer or null (e.g. 10 for top 10),
               "sortBy": string or null ("name", "rollNumber", "marks", "attendance", "admissionDate"),
               "sortDirection": string or null ("ASC" or "DESC"),
               "explanation": string (A brief clear human readable summary of what is being filtered)
            }
            Never return SQL. Only return valid raw JSON without markdown formatting.
            """;

        Map<String, Object> textPart = Map.of("text", systemInstruction + "\nUser Query: " + query);
        Map<String, Object> content = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String rawText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                String cleanedJson = cleanJsonString(rawText);
                StudentSearchCriteria criteria = objectMapper.readValue(cleanedJson, StudentSearchCriteria.class);
                criteria.validateAndSanitize();
                return criteria;
            }
        }
        return nlpParser.parse(query);
    }

    private StudentSearchCriteria callOpenAi(String query) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        String systemPrompt = "Extract student search criteria into JSON schema with rollNumber, nameQuery, emailQuery, departmentCode (CSE, ECE, MECH, CIVIL, IT), academicYear, semester, status, minAttendance, maxAttendance, minMarks, maxMarks, topN, sortBy, sortDirection, explanation. Only return raw JSON.";

        Map<String, Object> messageSystem = Map.of("role", "system", "content", systemPrompt);
        Map<String, Object> messageUser = Map.of("role", "user", "content", query);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName != null && modelName.startsWith("gpt") ? modelName : "gpt-4o-mini");
        requestBody.put("messages", List.of(messageSystem, messageUser));
        requestBody.put("response_format", Map.of("type", "json_object"));
        requestBody.put("temperature", 0.0);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            String rawJson = root.path("choices").get(0).path("message").path("content").asText();
            StudentSearchCriteria criteria = objectMapper.readValue(cleanJsonString(rawJson), StudentSearchCriteria.class);
            criteria.validateAndSanitize();
            return criteria;
        }
        return nlpParser.parse(query);
    }

    private String cleanJsonString(String text) {
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }
}
