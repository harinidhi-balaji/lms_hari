package com.lms.controller;

import com.lms.config.UserPrincipal;
import com.lms.dto.AdminCourseRequest;
import com.lms.dto.CourseRequest;
import com.lms.dto.CourseResponse;
import com.lms.dto.LessonRequest;
import com.lms.dto.LessonResponse;
import com.lms.entity.CourseStatus;
import com.lms.service.CourseService;
import com.lms.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Course management APIs")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private LessonService lessonService;

    // Public endpoints for browsing published courses
    @GetMapping("/public")
    @Operation(summary = "Get published courses", description = "Get all published courses with pagination")
    public ResponseEntity<Page<CourseResponse>> getPublishedCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CourseResponse> courses = courseService.getPublishedCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/search")
    @Operation(summary = "Search published courses", description = "Search published courses by keyword")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CourseResponse> courses = courseService.searchCourses(keyword, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/{id}")
    @Operation(summary = "Get course details", description = "Get published course details by ID")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        CourseResponse course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/public/{id}/lessons")
    @Operation(summary = "Get course lessons", description = "Get lessons for a published course")
    public ResponseEntity<List<LessonResponse>> getCourseLessons(@PathVariable Long id) {
        List<LessonResponse> lessons = lessonService.getLessonsByCourse(id);
        return ResponseEntity.ok(lessons);
    }

    // Instructor endpoints
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Create course", description = "Create a new course (Instructor only)")
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CourseRequest courseRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        CourseResponse course = courseService.createCourse(courseRequest, userPrincipal.getId());
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Update course", description = "Update course details (Instructor only)")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest courseRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        CourseResponse course = courseService.updateCourse(id, courseRequest, userPrincipal.getId());
        return ResponseEntity.ok(course);
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Get instructor courses", description = "Get courses created by the instructor")
    public ResponseEntity<Page<CourseResponse>> getInstructorCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CourseResponse> courses = courseService.getCoursesByInstructor(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Submit course for approval", description = "Submit course for admin approval")
    public ResponseEntity<CourseResponse> submitCourseForApproval(
            @PathVariable Long id,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        CourseResponse course = courseService.submitForApproval(id, userPrincipal.getId());
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete course", description = "Delete course (Instructor only)")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        courseService.deleteCourse(id, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    // Lesson management for instructors
    @PostMapping("/{courseId}/lessons")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Add lesson to course", description = "Add a new lesson to course")
    public ResponseEntity<LessonResponse> addLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonRequest lessonRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        LessonResponse lesson = lessonService.createLesson(courseId, lessonRequest, userPrincipal.getId());
        return ResponseEntity.ok(lesson);
    }

    @PutMapping("/{courseId}/lessons/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Update lesson", description = "Update lesson details")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequest lessonRequest,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        LessonResponse lesson = lessonService.updateLesson(lessonId, lessonRequest, userPrincipal.getId());
        return ResponseEntity.ok(lesson);
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete lesson", description = "Delete lesson from course")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        lessonService.deleteLesson(lessonId, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    // Admin endpoints
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create course as admin", description = "Create a new course and assign to instructor (Admin only)")
    public ResponseEntity<CourseResponse> adminCreateCourse(
            @Valid @RequestBody AdminCourseRequest courseRequest) {
        CourseResponse course = courseService.adminCreateCourse(courseRequest);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all courses", description = "Get all courses (Admin only)")
    public ResponseEntity<Page<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CourseResponse> courses = courseService.getAllCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending courses", description = "Get courses pending approval (Admin only)")
    public ResponseEntity<Page<CourseResponse>> getPendingCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CourseResponse> courses = courseService.getCoursesByStatus(CourseStatus.PENDING, pageable);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve course", description = "Approve pending course (Admin only)")
    public ResponseEntity<CourseResponse> approveCourse(@PathVariable Long id) {
        CourseResponse course = courseService.approveCourse(id);
        return ResponseEntity.ok(course);
    }

    @PostMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject course", description = "Reject pending course (Admin only)")
    public ResponseEntity<CourseResponse> rejectCourse(@PathVariable Long id) {
        CourseResponse course = courseService.rejectCourse(id);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete course (Admin)", description = "Delete any course (Admin only)")
    public ResponseEntity<Void> adminDeleteCourse(@PathVariable Long id) {
        courseService.adminDeleteCourse(id);
        return ResponseEntity.ok().build();
    }
}