package com.lms.repository;

import com.lms.entity.Enrollment;
import com.lms.entity.Lesson;
import com.lms.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);

    List<Progress> findByEnrollment(Enrollment enrollment);

    List<Progress> findByEnrollmentAndCompleted(Enrollment enrollment, Boolean completed);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.enrollment.id = :enrollmentId AND p.completed = true")
    int countCompletedProgressByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT p FROM Progress p WHERE p.enrollment.student.id = :studentId AND p.lesson.course.id = :courseId")
    List<Progress> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}