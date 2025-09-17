package com.lms.service;

import com.lms.dto.CourseRequest;
import com.lms.dto.CourseResponse;
import com.lms.entity.Course;
import com.lms.entity.CourseStatus;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CourseService courseService;

    private User instructor;
    private User student;
    private Course course;
    private CourseRequest courseRequest;

    @BeforeEach
    void setUp() {
        instructor = new User("instructor", "instructor@example.com", "password", "John", "Doe", Role.INSTRUCTOR);
        instructor.setId(1L);

        student = new User("student", "student@example.com", "password", "Jane", "Smith", Role.STUDENT);
        student.setId(2L);

        course = new Course("Test Course", "Test Description", instructor);
        course.setId(1L);
        course.setStatus(CourseStatus.DRAFT);

        courseRequest = new CourseRequest("Test Course", "Test Description", null);
    }

    @Test
    void createCourse_Success() {
        // Given
        when(userService.findById(1L)).thenReturn(instructor);
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // When
        CourseResponse result = courseService.createCourse(courseRequest, 1L);

        // Then
        assertNotNull(result);
        assertEquals("Test Course", result.getTitle());
        assertEquals("Test Description", result.getDescription());
        assertEquals(CourseStatus.DRAFT, result.getStatus());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createCourse_NotInstructor_ThrowsException() {
        // Given
        when(userService.findById(2L)).thenReturn(student);

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.createCourse(courseRequest, 2L)
        );
        assertEquals("Only instructors can create courses", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void updateCourse_Success() {
        // Given
        CourseRequest updateRequest = new CourseRequest("Updated Course", "Updated Description", null);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // When
        CourseResponse result = courseService.updateCourse(1L, updateRequest, 1L);

        // Then
        assertNotNull(result);
        verify(courseRepository).save(course);
        assertEquals("Updated Course", course.getTitle());
        assertEquals("Updated Description", course.getDescription());
    }

    @Test
    void updateCourse_NotOwner_ThrowsException() {
        // Given
        CourseRequest updateRequest = new CourseRequest("Updated Course", "Updated Description", null);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.updateCourse(1L, updateRequest, 2L)
        );
        assertEquals("You can only update your own courses", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void updateCourse_PublishedCourse_ThrowsException() {
        // Given
        course.setStatus(CourseStatus.PUBLISHED);
        CourseRequest updateRequest = new CourseRequest("Updated Course", "Updated Description", null);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.updateCourse(1L, updateRequest, 1L)
        );
        assertEquals("Cannot update published courses", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void findById_Success() {
        // Given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When
        Course result = courseService.findById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Course", result.getTitle());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        // Given
        when(courseRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> courseService.findById(999L)
        );
        assertTrue(exception.getMessage().contains("Course not found"));
    }

    @Test
    void getPublishedCourses_Success() {
        // Given
        Course publishedCourse = new Course("Published Course", "Description", instructor);
        publishedCourse.setStatus(CourseStatus.PUBLISHED);
        Page<Course> coursePage = new PageImpl<>(Arrays.asList(publishedCourse));
        Pageable pageable = PageRequest.of(0, 10);

        when(courseRepository.findByStatus(CourseStatus.PUBLISHED, pageable)).thenReturn(coursePage);

        // When
        Page<CourseResponse> result = courseService.getPublishedCourses(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Published Course", result.getContent().get(0).getTitle());
    }

    @Test
    void submitForApproval_Success() {
        // Given
        course.getLessons().add(null); // Simulate having lessons
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // When
        CourseResponse result = courseService.submitForApproval(1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(CourseStatus.PENDING, course.getStatus());
        verify(courseRepository).save(course);
    }

    @Test
    void submitForApproval_NotOwner_ThrowsException() {
        // Given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.submitForApproval(1L, 2L)
        );
        assertEquals("You can only submit your own courses for approval", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void submitForApproval_NotDraft_ThrowsException() {
        // Given
        course.setStatus(CourseStatus.PENDING);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.submitForApproval(1L, 1L)
        );
        assertEquals("Only draft courses can be submitted for approval", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void approveCourse_Success() {
        // Given
        course.setStatus(CourseStatus.PENDING);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // When
        CourseResponse result = courseService.approveCourse(1L);

        // Then
        assertNotNull(result);
        assertEquals(CourseStatus.PUBLISHED, course.getStatus());
        verify(courseRepository).save(course);
    }

    @Test
    void approveCourse_NotPending_ThrowsException() {
        // Given
        course.setStatus(CourseStatus.DRAFT);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.approveCourse(1L)
        );
        assertEquals("Only pending courses can be approved", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void rejectCourse_Success() {
        // Given
        course.setStatus(CourseStatus.PENDING);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // When
        CourseResponse result = courseService.rejectCourse(1L);

        // Then
        assertNotNull(result);
        assertEquals(CourseStatus.REJECTED, course.getStatus());
        verify(courseRepository).save(course);
    }

    @Test
    void deleteCourse_Success() {
        // Given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When
        courseService.deleteCourse(1L, 1L);

        // Then
        verify(courseRepository).delete(course);
    }

    @Test
    void deleteCourse_NotOwner_ThrowsException() {
        // Given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // When & Then
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> courseService.deleteCourse(1L, 2L)
        );
        assertEquals("You can only delete your own courses", exception.getMessage());
        verify(courseRepository, never()).delete(any(Course.class));
    }
}