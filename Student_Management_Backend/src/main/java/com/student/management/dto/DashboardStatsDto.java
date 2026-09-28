package com.student.management.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    private long totalStudents;
    private double averageAge;
    private Map<String, Long> courseDistribution;
    private List<StudentDto> latestStudents;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, double averageAge, Map<String, Long> courseDistribution, List<StudentDto> latestStudents) {
        this.totalStudents = totalStudents;
        this.averageAge = averageAge;
        this.courseDistribution = courseDistribution;
        this.latestStudents = latestStudents;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getAverageAge() {
        return averageAge;
    }

    public void setAverageAge(double averageAge) {
        this.averageAge = averageAge;
    }

    public Map<String, Long> getCourseDistribution() {
        return courseDistribution;
    }

    public void setCourseDistribution(Map<String, Long> courseDistribution) {
        this.courseDistribution = courseDistribution;
    }

    public List<StudentDto> getLatestStudents() {
        return latestStudents;
    }

    public void setLatestStudents(List<StudentDto> latestStudents) {
        this.latestStudents = latestStudents;
    }
}
