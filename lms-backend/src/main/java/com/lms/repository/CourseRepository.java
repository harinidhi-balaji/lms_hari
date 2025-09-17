package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.CourseStatus;
import com.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    Page<Course> findByInstructor(User instructor, Pageable pageable);

    Page<Course> findByInstructorAndStatus(User instructor, CourseStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> findPublishedCoursesWithKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    int countEnrollmentsByCourseId(@Param("courseId") Long courseId);
}