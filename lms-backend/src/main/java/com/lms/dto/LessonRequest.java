package com.lms.dto;

import com.lms.entity.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LessonRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    private String content;

    @NotNull
    private ContentType contentType;

    private String contentUrl;

    @NotNull
    private Integer orderIndex;

    public LessonRequest() {}

    public LessonRequest(String title, String content, ContentType contentType, String contentUrl, Integer orderIndex) {
        this.title = title;
        this.content = content;
        this.contentType = contentType;
        this.contentUrl = contentUrl;
        this.orderIndex = orderIndex;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}