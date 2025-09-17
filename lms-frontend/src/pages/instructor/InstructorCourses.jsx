import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../services/api';
import { Plus, BookOpen, Users, Calendar, Edit, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getMyCourses({ page: 0, size: 20 });
      setCourses(response.data.content);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (courseId) => {
    try {
      await coursesAPI.submitForApproval(courseId);
      toast.success('Course submitted for approval');
      loadCourses(); // Reload to update status
    } catch (error) {
      console.error('Error submitting course:', error);
      toast.error(error.response?.data?.message || 'Failed to submit course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await coursesAPI.deleteCourse(courseId);
        toast.success('Course deleted successfully');
        loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {status}
      </span>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your courses and track student engagement</p>
        </div>
        <Link to="/instructor/courses/new" className="btn-primary inline-flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    {getStatusBadge(course.status)}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.totalLessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollmentCount} students
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  {course.status === 'DRAFT' && (
                    <>
                      <button
                        onClick={() => handleSubmitForApproval(course.id)}
                        className="btn-outline inline-flex items-center"
                        disabled={course.totalLessons === 0}
                        title={course.totalLessons === 0 ? 'Add lessons before submitting' : ''}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Submit
                      </button>
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="btn-outline inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </>
                  )}

                  {(course.status === 'DRAFT' || course.status === 'REJECTED') && (
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="btn-outline text-red-600 hover:bg-red-50 border-red-300 inline-flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  )}

                  {course.status === 'PUBLISHED' && (
                    <Link
                      to={`/instructor/courses/${course.id}/analytics`}
                      className="btn-primary"
                    >
                      View Analytics
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Create your first course to get started</p>
          <Link to="/instructor/courses/new" className="btn-primary">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;