import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI, enrollmentsAPI, usersAPI } from '../services/api';
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isInstructor, isStudent } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (isStudent()) {
        await loadStudentDashboard();
      } else if (isInstructor()) {
        await loadInstructorDashboard();
      } else if (isAdmin()) {
        await loadAdminDashboard();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDashboard = async () => {
    try {
      const [enrollmentsResponse, coursesResponse] = await Promise.all([
        enrollmentsAPI.getMyEnrollments({ page: 0, size: 5 }),
        coursesAPI.getPublishedCourses({ page: 0, size: 5 }),
      ]);

      const enrollments = enrollmentsResponse.data.content;
      const totalEnrollments = enrollmentsResponse.data.totalElements;
      const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length;
      const inProgressCourses = enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length;

      setStats({
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        availableCourses: coursesResponse.data.totalElements,
      });

      setRecentActivity(enrollments.map(enrollment => ({
        id: enrollment.id,
        title: enrollment.courseTitle,
        type: 'enrollment',
        progress: enrollment.progressPercentage,
        date: enrollment.enrolledAt,
      })));
    } catch (error) {
      console.error('Error loading student dashboard:', error);
    }
  };

  const loadInstructorDashboard = async () => {
    try {
      const [coursesResponse, studentsResponse] = await Promise.all([
        coursesAPI.getMyCourses({ page: 0, size: 10 }),
        enrollmentsAPI.getMyStudents({ page: 0, size: 5 }),
      ]);

      const courses = coursesResponse.data.content;
      const totalStudents = studentsResponse.data.totalElements;

      setStats({
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.status === 'PUBLISHED').length,
        pendingCourses: courses.filter(c => c.status === 'PENDING').length,
        totalStudents,
      });

      setRecentActivity(courses.map(course => ({
        id: course.id,
        title: course.title,
        type: 'course',
        status: course.status,
        enrollments: course.enrollmentCount,
        date: course.createdAt,
      })));
    } catch (error) {
      console.error('Error loading instructor dashboard:', error);
    }
  };

  const loadAdminDashboard = async () => {
    try {
      const [usersResponse, coursesResponse, pendingCoursesResponse] = await Promise.all([
        usersAPI.getActiveUsers({ page: 0, size: 1 }),
        coursesAPI.getAllCourses({ page: 0, size: 1 }),
        coursesAPI.getPendingCourses({ page: 0, size: 5 }),
      ]);

      setStats({
        totalUsers: usersResponse.data.totalElements,
        totalCourses: coursesResponse.data.totalElements,
        pendingApprovals: pendingCoursesResponse.data.totalElements,
      });

      setRecentActivity(pendingCoursesResponse.data.content.map(course => ({
        id: course.id,
        title: course.title,
        type: 'approval',
        instructor: course.instructorName,
        date: course.createdAt,
      })));
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableCourses || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">My Learning Progress</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    Enrolled on {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.progress}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${activity.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstructorDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingCourses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">My Courses</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    Created on {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                  <span className="text-sm text-gray-500">{activity.enrollments} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Courses Pending Approval</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    By {activity.instructor} • Submitted {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-primary">Approve</button>
                  <button className="btn-secondary">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {isStudent() && "Ready to continue your learning journey?"}
            {isInstructor() && "Here's how your courses are performing."}
            {isAdmin() && "Here's your system overview."}
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      {isStudent() && renderStudentDashboard()}
      {isInstructor() && renderInstructorDashboard()}
      {isAdmin() && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;