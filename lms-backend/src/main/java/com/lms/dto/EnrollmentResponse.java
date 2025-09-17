package com.lms.dto;

import com.lms.entity.Enrollment;

import java.time.LocalDateTime;

public class EnrollmentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentFirstName;
    private String studentLastName;
    private String studentEmail;
    private String studentUsername;
    private Long courseId;
    private String courseTitle;
    private int completedLessons;
    private int totalLessons;
    private double progressPercentage;
    private LocalDateTime enrolledAt;

    public EnrollmentResponse() {}

    public EnrollmentResponse(Enrollment enrollment) {
        this.id = enrollment.getId();
        this.studentId = enrollment.getStudent().getId();
        this.studentName = enrollment.getStudent().getFullName();
        this.studentFirstName = enrollment.getStudent().getFirstName();
        this.studentLastName = enrollment.getStudent().getLastName();
        this.studentEmail = enrollment.getStudent().getEmail();
        this.studentUsername = enrollment.getStudent().getUsername();
        this.courseId = enrollment.getCourse().getId();
        this.courseTitle = enrollment.getCourse().getTitle();
        this.completedLessons = enrollment.getCompletedLessons();
        this.totalLessons = enrollment.getCourse().getTotalLessons();
        this.progressPercentage = enrollment.getProgressPercentage();
        this.enrolledAt = enrollment.getEnrolledAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentFirstName() {
        return studentFirstName;
    }

    public void setStudentFirstName(String studentFirstName) {
        this.studentFirstName = studentFirstName;
    }

    public String getStudentLastName() {
        return studentLastName;
    }

    public void setStudentLastName(String studentLastName) {
        this.studentLastName = studentLastName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentUsername() {
        return studentUsername;
    }

    public void setStudentUsername(String studentUsername) {
        this.studentUsername = studentUsername;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
}