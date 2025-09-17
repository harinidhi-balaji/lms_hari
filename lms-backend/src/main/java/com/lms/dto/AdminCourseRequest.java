package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdminCourseRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    private String thumbnailUrl;

    @NotNull
    private Long instructorId;

    public AdminCourseRequest() {}

    public AdminCourseRequest(String title, String description, String thumbnailUrl, Long instructorId) {
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.instructorId = instructorId;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }
}