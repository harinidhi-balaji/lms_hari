package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.Enrollment;
import com.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    boolean existsByStudentAndCourse(User student, Course course);

    Page<Enrollment> findByStudent(User student, Pageable pageable);

    Page<Enrollment> findByCourse(Course course, Pageable pageable);

    @Query("SELECT e FROM Enrollment e WHERE e.course.instructor.id = :instructorId")
    Page<Enrollment> findByInstructorId(@Param("instructorId") Long instructorId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId")
    int countByStudentId(@Param("studentId") Long studentId);
}