import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../../services/api';
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  ArrowLeft,
  Heart,
  Star
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import CourseRating from '../../components/course/CourseRating';
import Certificate from '../../components/course/Certificate';
import Discussion from '../../components/course/Discussion';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseResponse, lessonsResponse, reviewsResponse] = await Promise.all([
        coursesAPI.getCourseById(id),
        coursesAPI.getCourseLessons(id),
        coursesAPI.getCourseReviews(id),
      ]);

      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data);

      // Check enrollment status
      try {
        const enrollmentStatus = await enrollmentsAPI.checkEnrollmentStatus(id);
        setIsEnrolled(enrollmentStatus.data);

        if (enrollmentStatus.data) {
          // Load progress if enrolled
          const progressResponse = await enrollmentsAPI.getCourseProgress(id);
          setProgress(progressResponse.data);
        }
      } catch (error) {
        // Not enrolled or error checking
        setIsEnrolled(false);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollmentsAPI.enrollInCourse(id);
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
      loadCourseData(); // Reload to get progress data
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const handleLessonComplete = async (lessonId, isCompleted) => {
    try {
      if (isCompleted) {
        await enrollmentsAPI.markLessonComplete(id, lessonId);
        toast.success('Lesson marked as complete!');
      } else {
        await enrollmentsAPI.markLessonIncomplete(id, lessonId);
        toast.success('Lesson marked as incomplete');
      }

      // Update progress
      const progressResponse = await enrollmentsAPI.getCourseProgress(id);
      setProgress(progressResponse.data);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error('Failed to update lesson progress');
    }
  };

  const getProgressForLesson = (lessonId) => {
    return progress.find(p => p.lesson.id === lessonId);
  };

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'VIDEO':
        return <PlayCircle className="h-5 w-5" />;
      case 'PDF':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const calculateCompletionPercentage = () => {
    if (!progress.length || !lessons.length) return 0;
    const completedCount = progress.filter(p => p.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <Link to="/courses" className="btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="card">
        <div className="card-header">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{course.instructorName}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <div className="space-y-4">
                {isEnrolled ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {calculateCompletionPercentage()}%
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${calculateCompletionPercentage()}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Enrolled
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleEnroll}
                      className="w-full btn-primary"
                    >
                      Enroll in Course
                    </button>
                    <button
                      onClick={() => isInWishlist(course.id) 
                        ? removeFromWishlist(course.id) 
                        : addToWishlist(course)
                      }
                      className={`w-full btn-outline flex items-center justify-center gap-2 ${
                        isInWishlist(course.id) ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(course.id) ? 'fill-current' : ''}`} />
                      {isInWishlist(course.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                )}

                {/* Course Stats */}
                <div className="border-t pt-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students enrolled</span>
                      <span className="font-medium">{course.enrollmentCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Course rating</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{course.averageRating?.toFixed(1) || 'N/A'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last updated</span>
                      <span className="font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
        </div>
      </div>

      {/* Certificate Section */}
      {isEnrolled && calculateCompletionPercentage() === 100 && (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Course Certificate</h2>
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="btn-primary"
            >
              {showCertificate ? 'Hide Certificate' : 'View Certificate'}
            </button>
          </div>
          {showCertificate && (
            <div className="card-content">
              <Certificate
                course={course}
                completionDate={new Date()}
                studentName={`${user.firstName} ${user.lastName}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Discussion Section */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Course Discussion</h2>
          <button
            onClick={() => setShowDiscussion(!showDiscussion)}
            className="btn-primary"
          >
            {showDiscussion ? 'Hide Discussion' : 'View Discussion'}
          </button>
        </div>
        {showDiscussion && (
          <div className="card-content">
            <Discussion courseId={id} />
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="card mt-6">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Student Reviews</h2>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-primary-600 hover:text-primary-700"
          >
            {showReviews ? 'Hide Reviews' : 'Show Reviews'}
          </button>
        </div>
        {showReviews && (
          <div className="card-content">
            {isEnrolled && (
              <div className="mb-6 border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                <CourseRating
                  courseId={course.id}
                  onRatingSubmit={(newReview) => {
                    setReviews([newReview, ...reviews]);
                  }}
                />
              </div>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {review.userName}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-600">
                  No reviews yet. Be the first to review this course!
                </div>
              )}
            </div>
          </div>
        )}
        <div className="card-content">
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const lessonProgress = getProgressForLesson(lesson.id);
              const isCompleted = lessonProgress?.completed || false;

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-lg border ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getContentTypeIcon(lesson.contentType)}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {index + 1}. {lesson.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{lesson.contentType}</span>
                          {isEnrolled && lessonProgress && (
                            <span>
                              • {isCompleted ? 'Completed' : 'Not completed'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isEnrolled && (
                      <button
                        onClick={() => handleLessonComplete(lesson.id, !isCompleted)}
                        className={`btn ${
                          isCompleted ? 'btn-secondary' : 'btn-primary'
                        }`}
                      >
                        {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                    )}
                  </div>

                  {isEnrolled && lesson.content && (
                    <div className="mt-4 p-4 bg-white rounded border">
                      <p className="text-gray-700">{lesson.content}</p>
                      {lesson.contentUrl && (
                        <div className="mt-2">
                          <a
                            href={lesson.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 underline"
                          >
                            View Resource
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isEnrolled && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Enroll to Access Course Content
              </h3>
              <p className="text-gray-600 mb-4">
                Join this course to access all lessons and track your progress.
              </p>
              <button
                onClick={handleEnroll}
                className="btn-primary"
              >
                Enroll Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;