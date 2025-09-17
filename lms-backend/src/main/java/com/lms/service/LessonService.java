package com.lms.service;

import com.lms.dto.LessonRequest;
import com.lms.dto.LessonResponse;
import com.lms.entity.Course;
import com.lms.entity.CourseStatus;
import com.lms.entity.Lesson;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseService courseService;

    public LessonResponse createLesson(Long courseId, LessonRequest lessonRequest, Long instructorId) {
        Course course = courseService.findById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only add lessons to your own courses");
        }

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Cannot add lessons to published courses");
        }

        // Auto-generate order index if not provided
        if (lessonRequest.getOrderIndex() == null) {
            Integer maxOrder = lessonRepository.findMaxOrderIndexByCourseId(courseId);
            lessonRequest.setOrderIndex(maxOrder == null ? 1 : maxOrder + 1);
        } else {
            // Check if order index already exists
            if (lessonRepository.existsByCourseIdAndOrderIndex(courseId, lessonRequest.getOrderIndex())) {
                throw new BadRequestException("A lesson with this order index already exists");
            }
        }

        Lesson lesson = new Lesson(
                lessonRequest.getTitle(),
                lessonRequest.getContent(),
                lessonRequest.getContentType(),
                lessonRequest.getOrderIndex(),
                course
        );
        lesson.setContentUrl(lessonRequest.getContentUrl());

        Lesson savedLesson = lessonRepository.save(lesson);
        return new LessonResponse(savedLesson);
    }

    public LessonResponse updateLesson(Long lessonId, LessonRequest lessonRequest, Long instructorId) {
        Lesson lesson = findById(lessonId);
        Course course = lesson.getCourse();

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only update lessons in your own courses");
        }

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Cannot update lessons in published courses");
        }

        // Check order index conflict only if it's different from current
        if (!lesson.getOrderIndex().equals(lessonRequest.getOrderIndex()) &&
            lessonRepository.existsByCourseIdAndOrderIndex(course.getId(), lessonRequest.getOrderIndex())) {
            throw new BadRequestException("A lesson with this order index already exists");
        }

        lesson.setTitle(lessonRequest.getTitle());
        lesson.setContent(lessonRequest.getContent());
        lesson.setContentType(lessonRequest.getContentType());
        lesson.setContentUrl(lessonRequest.getContentUrl());
        lesson.setOrderIndex(lessonRequest.getOrderIndex());

        Lesson updatedLesson = lessonRepository.save(lesson);
        return new LessonResponse(updatedLesson);
    }

    public Lesson findById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
    }

    public LessonResponse getLessonById(Long id) {
        Lesson lesson = findById(id);
        return new LessonResponse(lesson);
    }

    public List<LessonResponse> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId)
                .stream()
                .map(LessonResponse::new)
                .collect(Collectors.toList());
    }

    public void deleteLesson(Long lessonId, Long instructorId) {
        Lesson lesson = findById(lessonId);
        Course course = lesson.getCourse();

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only delete lessons from your own courses");
        }

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Cannot delete lessons from published courses");
        }

        lessonRepository.delete(lesson);
    }

    public void reorderLessons(Long courseId, List<Long> lessonIds, Long instructorId) {
        Course course = courseService.findById(courseId);

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new BadRequestException("You can only reorder lessons in your own courses");
        }

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Cannot reorder lessons in published courses");
        }

        List<Lesson> lessons = course.getLessons();
        if (lessons.size() != lessonIds.size()) {
            throw new BadRequestException("All lessons must be included in reorder operation");
        }

        for (int i = 0; i < lessonIds.size(); i++) {
            Long lessonId = lessonIds.get(i);
            Lesson lesson = lessons.stream()
                    .filter(l -> l.getId().equals(lessonId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

            lesson.setOrderIndex(i + 1);
            lessonRepository.save(lesson);
        }
    }
}