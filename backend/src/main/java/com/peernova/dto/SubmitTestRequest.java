package com.peernova.dto;

import java.util.Map;

public class SubmitTestRequest {

    // Map of questionId -> selectedOption ("A", "B", "C", "D")
    private Map<Long, String> answers;

    public SubmitTestRequest() {
    }

    public SubmitTestRequest(Map<Long, String> answers) {
        this.answers = answers;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
