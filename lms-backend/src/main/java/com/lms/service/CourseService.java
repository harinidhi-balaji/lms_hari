package com.lms.service;

import com.lms.dto.AdminCourseRequest;
import com.lms.dto.CourseRequest;
import com.lms.dto.CourseResponse;
import com.lms.entity.Course;
import com.lms.entity.CourseStatus;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserService userService;

    public CourseResponse createCourse(CourseRequest courseRequest, Long instructorId) {
        User instructor = userService.findById(instructorId);

        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new BadRequestException("Only instructors can create courses");
        }

        Course course = new Course(
                courseRequest.getTitle(),
                courseRequest.getDescription(),
                instructor
        );
        course.setThumbnailUrl(courseRequest.getThumbnailUrl());
        course.setStatus(CourseStatus.PUBLISHED); // Auto-approve new courses

        Course savedCourse = courseRepository.save(course);
        return new CourseResponse(savedCourse);
    }

    public CourseResponse adminCreateCourse(AdminCourseRequest courseRequest) {
        User instructor = userService.findById(courseRequest.getInstructorId());

        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new BadRequestException("Selected user must be an instructor");
        }

        Course course = new Course(
                courseRequest.getTitle(),
                courseRequest.getDescription(),
                instructor
        );
        course.setThumbnailUrl(courseRequest.getThumbnailUrl());
        course.setStatus(CourseStatus.PUBLISHED); // Auto-approve new courses

        Course savedCourse = courseRepository.save(course);
        return new CourseResponse(savedCourse);
    }

    public CourseResponse updateCourse(Long courseId, CourseRequest courseRequest, Long instructorId) {
        Course course = findById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only update your own courses");
        }

        // Allow updates for published courses since all new courses are auto-published
        // Only prevent updates if course has enrollments to maintain data integrity
        if (course.getStatus() == CourseStatus.PUBLISHED && !course.getEnrollments().isEmpty()) {
            throw new BadRequestException("Cannot update published courses with active enrollments");
        }

        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        course.setThumbnailUrl(courseRequest.getThumbnailUrl());

        Course updatedCourse = courseRepository.save(course);
        return new CourseResponse(updatedCourse);
    }

    public Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    public CourseResponse getCourseById(Long id) {
        Course course = findById(id);
        return new CourseResponse(course);
    }

    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable)
                .map(CourseResponse::new);
    }

    public Page<CourseResponse> getPublishedCourses(Pageable pageable) {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::new);
    }

    public Page<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable) {
        User instructor = userService.findById(instructorId);
        return courseRepository.findByInstructor(instructor, pageable)
                .map(CourseResponse::new);
    }

    public Page<CourseResponse> getCoursesByStatus(CourseStatus status, Pageable pageable) {
        return courseRepository.findByStatus(status, pageable)
                .map(CourseResponse::new);
    }

    public Page<CourseResponse> searchCourses(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getPublishedCourses(pageable);
        }
        return courseRepository.findPublishedCoursesWithKeyword(keyword.trim(), pageable)
                .map(CourseResponse::new);
    }

    public CourseResponse submitForApproval(Long courseId, Long instructorId) {
        Course course = findById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only submit your own courses for approval");
        }

        // Since courses are now auto-approved, this method is deprecated
        // but we'll keep it for backward compatibility
        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Course is already published");
        }

        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new BadRequestException("Only draft courses can be submitted for approval");
        }

        if (course.getLessons().isEmpty()) {
            throw new BadRequestException("Course must have at least one lesson before submission");
        }

        // Auto-approve instead of setting to pending
        course.setStatus(CourseStatus.PUBLISHED);
        Course updatedCourse = courseRepository.save(course);
        return new CourseResponse(updatedCourse);
    }

    public CourseResponse approveCourse(Long courseId) {
        Course course = findById(courseId);

        if (course.getStatus() != CourseStatus.PENDING) {
            throw new BadRequestException("Only pending courses can be approved");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        Course updatedCourse = courseRepository.save(course);
        return new CourseResponse(updatedCourse);
    }

    public CourseResponse rejectCourse(Long courseId) {
        Course course = findById(courseId);

        if (course.getStatus() != CourseStatus.PENDING) {
            throw new BadRequestException("Only pending courses can be rejected");
        }

        course.setStatus(CourseStatus.REJECTED);
        Course updatedCourse = courseRepository.save(course);
        return new CourseResponse(updatedCourse);
    }

    public void deleteCourse(Long courseId, Long instructorId) {
        Course course = findById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only delete your own courses");
        }

        if (course.getStatus() == CourseStatus.PUBLISHED && !course.getEnrollments().isEmpty()) {
            throw new BadRequestException("Cannot delete published courses with enrollments");
        }

        courseRepository.delete(course);
    }

    public void adminDeleteCourse(Long courseId) {
        Course course = findById(courseId);
        courseRepository.delete(course);
    }
}