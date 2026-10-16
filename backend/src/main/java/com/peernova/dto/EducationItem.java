package com.peernova.dto;

public class EducationItem {
    private String degree;
    private String institution;
    private String fieldOfStudy;
    private String startYear;
    private String endYear;
    private String gpa;

    public EducationItem() {}

    public EducationItem(String degree, String institution, String fieldOfStudy, String startYear, String endYear, String gpa) {
        this.degree = degree;
        this.institution = institution;
        this.fieldOfStudy = fieldOfStudy;
        this.startYear = startYear;
        this.endYear = endYear;
        this.gpa = gpa;
    }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }

    public String getStartYear() { return startYear; }
    public void setStartYear(String startYear) { this.startYear = startYear; }

    public String getEndYear() { return endYear; }
    public void setEndYear(String endYear) { this.endYear = endYear; }

    public String getGpa() { return gpa; }
    public void setGpa(String gpa) { this.gpa = gpa; }
}
