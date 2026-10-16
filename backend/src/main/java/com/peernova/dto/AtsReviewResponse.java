package com.peernova.dto;

import java.util.List;

public class AtsReviewResponse {
    private Integer overallScore;
    private String summaryFeedback;
    private List<String> strengths;
    private List<String> improvements;
    private List<String> recommendedKeywords;

    public AtsReviewResponse() {}

    public AtsReviewResponse(Integer overallScore, String summaryFeedback, List<String> strengths, List<String> improvements, List<String> recommendedKeywords) {
        this.overallScore = overallScore;
        this.summaryFeedback = summaryFeedback;
        this.strengths = strengths;
        this.improvements = improvements;
        this.recommendedKeywords = recommendedKeywords;
    }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public List<String> getRecommendedKeywords() { return recommendedKeywords; }
    public void setRecommendedKeywords(List<String> recommendedKeywords) { this.recommendedKeywords = recommendedKeywords; }
}
