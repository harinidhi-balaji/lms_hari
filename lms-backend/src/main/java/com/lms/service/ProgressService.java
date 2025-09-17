package com.lms.service;

import com.lms.entity.Enrollment;
import com.lms.entity.Lesson;
import com.lms.entity.Progress;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private LessonService lessonService;

    public Progress markLessonComplete(Long studentId, Long courseId, Long lessonId) {
        Enrollment enrollment = enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId);
        Lesson lesson = lessonService.findById(lessonId);

        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new BadRequestException("Lesson does not belong to the specified course");
        }

        Progress progress = progressRepository.findByEnrollmentAndLesson(enrollment, lesson)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for lesson"));

        progress.setCompleted(true);
        return progressRepository.save(progress);
    }

    public Progress markLessonIncomplete(Long studentId, Long courseId, Long lessonId) {
        Enrollment enrollment = enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId);
        Lesson lesson = lessonService.findById(lessonId);

        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new BadRequestException("Lesson does not belong to the specified course");
        }

        Progress progress = progressRepository.findByEnrollmentAndLesson(enrollment, lesson)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for lesson"));

        progress.setCompleted(false);
        return progressRepository.save(progress);
    }

    public List<Progress> getStudentProgressForCourse(Long studentId, Long courseId) {
        return progressRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public Progress getStudentProgressForLesson(Long studentId, Long courseId, Long lessonId) {
        Enrollment enrollment = enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId);
        Lesson lesson = lessonService.findById(lessonId);

        return progressRepository.findByEnrollmentAndLesson(enrollment, lesson)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for lesson"));
    }

    public void createProgressForNewLesson(Long lessonId) {
        Lesson lesson = lessonService.findById(lessonId);
        List<Enrollment> enrollments = lesson.getCourse().getEnrollments().stream().toList();

        for (Enrollment enrollment : enrollments) {
            Progress progress = new Progress(enrollment, lesson);
            progressRepository.save(progress);
        }
    }
}