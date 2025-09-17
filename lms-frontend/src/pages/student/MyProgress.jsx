import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';
import { BookOpen, Award, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProgress = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgress: 0,
    totalLessonsCompleted: 0
  });

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentsAPI.getMyEnrollments({
        page: 0,
        size: 100,
        includeProgress: true
      });

      setEnrollments(response.data.content);
      calculateStats(response.data.content);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollmentData) => {
    const stats = enrollmentData.reduce((acc, enrollment) => {
      const completedLessons = enrollment.progress.filter(p => p.completed).length;
      const isCompleted = completedLessons === enrollment.course.totalLessons;

      return {
        totalCourses: acc.totalCourses + 1,
        completedCourses: acc.completedCourses + (isCompleted ? 1 : 0),
        inProgress: acc.inProgress + (!isCompleted && completedLessons > 0 ? 1 : 0),
        totalLessonsCompleted: acc.totalLessonsCompleted + completedLessons
      };
    }, {
      totalCourses: 0,
      completedCourses: 0,
      inProgress: 0,
      totalLessonsCompleted: 0
    });

    setStats(stats);
  };

  const calculateProgress = (enrollment) => {
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    return Math.round((completedLessons / enrollment.course.totalLessons) * 100);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Learning Progress</h1>
        <p className="text-gray-600">Track your progress across all enrolled courses</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessonsCompleted}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress List */}
      <div className="space-y-4">
        {enrollments.map((enrollment) => {
          const progress = calculateProgress(enrollment);
          
          return (
            <div key={enrollment.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-content">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {enrollment.course.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{enrollment.course.totalLessons} lessons</span>
                      <span>•</span>
                      <span>
                        {enrollment.progress.filter(p => p.completed).length} completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{progress}% complete</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/courses/${enrollment.course.id}`}
                      className="btn-primary whitespace-nowrap"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {enrollments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProgress;
