import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';
import { BookOpen, Calendar, TrendingUp, ExternalLink } from 'lucide-react';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentsAPI.getMyEnrollments({ page: 0, size: 20 });
      setEnrollments(response.data.content);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>
        <p className="text-gray-600">Track your learning progress</p>
      </div>

      <div className="grid gap-6">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {enrollment.courseTitle}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{enrollment.progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <Link
                    to={`/courses/${enrollment.courseId}`}
                    className="btn-primary inline-flex items-center"
                  >
                    Continue Learning
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
          <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;