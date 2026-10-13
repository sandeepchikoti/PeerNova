package com.peernova.dto;

public class QuestionFeedbackDTO {
    private Long questionId;
    private String questionText;
    private String selectedOption;
    private String correctOption;
    private boolean isCorrect;
    private String explanation;

    public QuestionFeedbackDTO() {
    }

    public QuestionFeedbackDTO(Long questionId, String questionText, String selectedOption,
                               String correctOption, boolean isCorrect, String explanation) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.selectedOption = selectedOption;
        this.correctOption = correctOption;
        this.isCorrect = isCorrect;
        this.explanation = explanation;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
