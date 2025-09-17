package com.lms.service;

import com.lms.dto.EnrollmentResponse;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    public EnrollmentResponse enrollStudent(Long courseId, Long studentId) {
        User student = userService.findById(studentId);
        Course course = courseService.findById(courseId);

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can enroll in courses");
        }

        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new BadRequestException("Can only enroll in published courses");
        }

        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new BadRequestException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(student, course);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Create initial progress records for all lessons
        createInitialProgress(savedEnrollment);

        return new EnrollmentResponse(savedEnrollment);
    }

    private void createInitialProgress(Enrollment enrollment) {
        List<Lesson> lessons = enrollment.getCourse().getLessons();
        for (Lesson lesson : lessons) {
            Progress progress = new Progress(enrollment, lesson);
            progressRepository.save(progress);
        }
    }

    public Enrollment findById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));
    }

    public EnrollmentResponse getEnrollmentById(Long id) {
        Enrollment enrollment = findById(id);
        return new EnrollmentResponse(enrollment);
    }

    public Page<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable) {
        User student = userService.findById(studentId);
        return enrollmentRepository.findByStudent(student, pageable)
                .map(EnrollmentResponse::new);
    }

    public Page<EnrollmentResponse> getCourseEnrollments(Long courseId, Pageable pageable) {
        Course course = courseService.findById(courseId);
        return enrollmentRepository.findByCourse(course, pageable)
                .map(EnrollmentResponse::new);
    }

    public Page<EnrollmentResponse> getInstructorEnrollments(Long instructorId, Pageable pageable) {
        return enrollmentRepository.findByInstructorId(instructorId, pageable)
                .map(EnrollmentResponse::new);
    }

    public Page<EnrollmentResponse> getAllEnrollments(Pageable pageable) {
        return enrollmentRepository.findAll(pageable)
                .map(EnrollmentResponse::new);
    }

    public void unenrollStudent(Long enrollmentId, Long studentId) {
        Enrollment enrollment = findById(enrollmentId);

        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("You can only unenroll from your own courses");
        }

        enrollmentRepository.delete(enrollment);
    }

    public void adminUnenrollStudent(Long enrollmentId) {
        Enrollment enrollment = findById(enrollmentId);
        enrollmentRepository.delete(enrollment);
    }

    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        User student = userService.findById(studentId);
        Course course = courseService.findById(courseId);
        return enrollmentRepository.existsByStudentAndCourse(student, course);
    }

    public Enrollment getEnrollmentByStudentAndCourse(Long studentId, Long courseId) {
        User student = userService.findById(studentId);
        Course course = courseService.findById(courseId);
        return enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for student and course"));
    }
}