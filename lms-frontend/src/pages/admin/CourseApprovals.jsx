import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../services/api';
import {
  Check,
  X,
  Eye,
  Calendar,
  User,
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseApprovals = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0
  });

  useEffect(() => {
    loadCourses();
  }, [statusFilter]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let response;

      switch (statusFilter) {
        case 'PENDING':
          response = await coursesAPI.getPendingCourses({ page: 0, size: 100 });
          break;
        case 'APPROVED':
          response = await coursesAPI.getPublishedCourses({ page: 0, size: 100 });
          break;
        case 'ALL':
          response = await coursesAPI.getAllCourses({ page: 0, size: 100 });
          break;
        default:
          response = await coursesAPI.getPendingCourses({ page: 0, size: 100 });
      }

      const courseList = response.data.content || [];
      setCourses(courseList);

      // Calculate stats
      const stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0
      };

      courseList.forEach(course => {
        switch (course.status) {
          case 'PENDING':
            stats.pending++;
            break;
          case 'PUBLISHED':
            stats.approved++;
            break;
          case 'REJECTED':
            stats.rejected++;
            break;
          case 'DRAFT':
            stats.draft++;
            break;
        }
      });

      setStats(stats);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await coursesAPI.approveCourse(courseId);
      toast.success('Course approved successfully');
      loadCourses(); // Reload the list
    } catch (error) {
      console.error('Error approving course:', error);
      toast.error('Failed to approve course');
    }
  };

  const handleRejectCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to reject this course?')) {
      try {
        await coursesAPI.rejectCourse(courseId);
        toast.success('Course rejected');
        loadCourses(); // Reload the list
      } catch (error) {
        console.error('Error rejecting course:', error);
        toast.error('Failed to reject course');
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Course Approvals</h1>
        <p className="text-gray-600">Review and manage courses across all statuses</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="ALL">All Courses</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card">
            <div className="card-content">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(course.status)}`}>
                      {course.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {course.instructorName}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.totalLessons || 0} lessons
                    </div>
                    {course.enrollmentCount !== undefined && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrollmentCount} enrolled
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  {course.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApproveCourse(course.id)}
                        className="btn-primary inline-flex items-center bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectCourse(course.id)}
                        className="btn-outline text-red-600 hover:bg-red-50 border-red-300 inline-flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn-outline inline-flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No courses match your criteria'
              : 'No courses found'
            }
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria'
              : 'Courses will appear here once instructors submit them'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseApprovals;