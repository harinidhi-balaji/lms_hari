package com.lms.controller;

import com.lms.config.UserPrincipal;
import com.lms.dto.EnrollmentResponse;
import com.lms.entity.Progress;
import com.lms.service.EnrollmentService;
import com.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/enrollments")
@Tag(name = "Enrollments", description = "Enrollment management APIs")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private ProgressService progressService;

    // Student endpoints
    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Enroll in course", description = "Enroll student in a course")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        EnrollmentResponse enrollment = enrollmentService.enrollStudent(courseId, userPrincipal.getId());
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get student enrollments", description = "Get all enrollments for the current student")
    public ResponseEntity<Page<EnrollmentResponse>> getMyEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrolledAt").descending());
        Page<EnrollmentResponse> enrollments = enrollmentService.getStudentEnrollments(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(enrollments);
    }

    @DeleteMapping("/{enrollmentId}/unenroll")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Unenroll from course", description = "Unenroll student from a course")
    public ResponseEntity<Void> unenrollFromCourse(
            @PathVariable Long enrollmentId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        enrollmentService.unenrollStudent(enrollmentId, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Check enrollment status", description = "Check if student is enrolled in a course")
    public ResponseEntity<Boolean> checkEnrollmentStatus(
            @PathVariable Long courseId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        boolean isEnrolled = enrollmentService.isStudentEnrolled(userPrincipal.getId(), courseId);
        return ResponseEntity.ok(isEnrolled);
    }

    // Progress tracking endpoints
    @PostMapping("/progress/{courseId}/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Mark lesson complete", description = "Mark a lesson as completed")
    public ResponseEntity<Progress> markLessonComplete(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Progress progress = progressService.markLessonComplete(userPrincipal.getId(), courseId, lessonId);
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/progress/{courseId}/lessons/{lessonId}/incomplete")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Mark lesson incomplete", description = "Mark a lesson as incomplete")
    public ResponseEntity<Progress> markLessonIncomplete(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Progress progress = progressService.markLessonIncomplete(userPrincipal.getId(), courseId, lessonId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/progress/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get course progress", description = "Get student's progress for a course")
    public ResponseEntity<List<Progress>> getCourseProgress(
            @PathVariable Long courseId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Progress> progress = progressService.getStudentProgressForCourse(userPrincipal.getId(), courseId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/progress/{courseId}/lessons/{lessonId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get lesson progress", description = "Get student's progress for a specific lesson")
    public ResponseEntity<Progress> getLessonProgress(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Progress progress = progressService.getStudentProgressForLesson(userPrincipal.getId(), courseId, lessonId);
        return ResponseEntity.ok(progress);
    }

    // Instructor endpoints
    @GetMapping("/instructor/my-students")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Get instructor's students", description = "Get all students enrolled in instructor's courses")
    public ResponseEntity<Page<EnrollmentResponse>> getInstructorStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrolledAt").descending());
        Page<EnrollmentResponse> enrollments = enrollmentService.getInstructorEnrollments(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get course enrollments", description = "Get all enrollments for a specific course")
    public ResponseEntity<Page<EnrollmentResponse>> getCourseEnrollments(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrolledAt").descending());
        Page<EnrollmentResponse> enrollments = enrollmentService.getCourseEnrollments(courseId, pageable);
        return ResponseEntity.ok(enrollments);
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all enrollments", description = "Get all enrollments (Admin only)")
    public ResponseEntity<Page<EnrollmentResponse>> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrolledAt").descending());
        Page<EnrollmentResponse> enrollments = enrollmentService.getAllEnrollments(pageable);
        return ResponseEntity.ok(enrollments);
    }

    @DeleteMapping("/admin/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete enrollment (Admin)", description = "Delete any enrollment (Admin only)")
    public ResponseEntity<Void> adminDeleteEnrollment(@PathVariable Long enrollmentId) {
        enrollmentService.adminUnenrollStudent(enrollmentId);
        return ResponseEntity.ok().build();
    }
}