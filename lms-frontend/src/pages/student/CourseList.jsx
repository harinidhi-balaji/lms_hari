import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../../services/api';
import { BookOpen, User, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getPublishedCourses({
        page: 0,
        size: 50
      });
      console.log('Courses loaded:', response.data);
      setCourses(response.data.content || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const response = await enrollmentsAPI.getMyEnrollments({ page: 0, size: 100 });
      const enrolledIds = new Set(response.data.content.map(e => e.courseId));
      setEnrolledCourses(enrolledIds);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollmentsAPI.enrollInCourse(courseId);
      toast.success('Successfully enrolled in course!');
      setEnrolledCourses(prev => new Set([...prev, courseId]));
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-600">Discover and enroll in courses that interest you</p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="card-content">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{course.instructorName}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{course.enrollmentCount} enrolled</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </Link>

                  {enrolledCourses.has(course.id) ? (
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back later for new courses!</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;