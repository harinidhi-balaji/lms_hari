import React, { useState, useEffect } from 'react';
import { enrollmentsAPI } from '../../services/api';
import {
  Users,
  Search,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  TrendingUp,
  Mail,
  Phone,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEnrollments: 0,
    uniqueCourses: 0,
    activeStudents: 0
  });

  useEffect(() => {
    loadMyStudents();
  }, []);

  const loadMyStudents = async () => {
    try {
      setLoading(true);
      const response = await enrollmentsAPI.getMyStudents({ page: 0, size: 100 });
      const enrollmentData = response.data.content || [];
      console.log('My Students API Response:', response.data);
      console.log('Enrollment Data:', enrollmentData);

      // Group enrollments by student
      const studentMap = new Map();
      enrollmentData.forEach(enrollment => {
        const studentId = enrollment.studentId;
        if (!studentMap.has(studentId)) {
          // Handle both old and new API response formats
          let firstName, lastName;
          if (enrollment.studentFirstName && enrollment.studentLastName) {
            // New format with separate fields
            firstName = enrollment.studentFirstName;
            lastName = enrollment.studentLastName;
          } else if (enrollment.studentName) {
            // Old format with full name - split it
            const nameParts = enrollment.studentName.split(' ');
            firstName = nameParts[0] || 'Unknown';
            lastName = nameParts.slice(1).join(' ') || 'Student';
          } else {
            firstName = 'Unknown';
            lastName = 'Student';
          }

          studentMap.set(studentId, {
            id: studentId,
            firstName: firstName,
            lastName: lastName,
            username: enrollment.studentUsername || `student${studentId}`,
            email: enrollment.studentEmail || `student${studentId}@example.com`,
            enrollments: []
          });
        }
        studentMap.get(studentId).enrollments.push({
          courseId: enrollment.courseId,
          courseName: enrollment.courseTitle,
          enrolledAt: enrollment.enrolledAt,
          progress: Math.round(enrollment.progressPercentage || 0),
          completed: enrollment.progressPercentage >= 100,
          totalLessons: enrollment.totalLessons,
          completedLessons: enrollment.completedLessons
        });
      });

      const studentsWithCourses = Array.from(studentMap.values());
      console.log('Processed Students:', studentsWithCourses);
      setStudents(studentsWithCourses);

      // Calculate stats
      const uniqueCourses = new Set(enrollmentData.map(e => e.courseId)).size;
      setStats({
        totalStudents: studentsWithCourses.length,
        totalEnrollments: enrollmentData.length,
        uniqueCourses: uniqueCourses,
        activeStudents: studentsWithCourses.filter(s => s.enrollments.some(e => !e.completed)).length
      });

    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = !courseFilter ||
      student.enrollments.some(enrollment =>
        enrollment.courseName.toLowerCase().includes(courseFilter.toLowerCase())
      );

    return matchesSearch && matchesCourse;
  });

  const getAllCourses = () => {
    const allCourses = new Set();
    students.forEach(student => {
      student.enrollments.forEach(enrollment => {
        allCourses.add(enrollment.courseName);
      });
    });
    return Array.from(allCourses).sort();
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600">View and manage students enrolled in your courses</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueCourses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="input"
          >
            <option value="">All Courses</option>
            {getAllCourses().map(courseName => (
              <option key={courseName} value={courseName}>{courseName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="grid gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="card">
            <div className="card-content">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Student Avatar */}
                  <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {student.firstName?.[0]}{student.lastName?.[0]}
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        @{student.username}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {student.email}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {student.enrollments.length} course{student.enrollments.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Enrolled Courses:</h4>
                      <div className="grid gap-2">
                        {student.enrollments.map((enrollment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="h-4 w-4 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">{enrollment.courseName}</p>
                                <p className="text-xs text-gray-500">
                                  Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {enrollment.progress}% Complete
                                </p>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${enrollment.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              {enrollment.completed && (
                                <div className="flex items-center text-green-600">
                                  <GraduationCap className="h-4 w-4 mr-1" />
                                  <span className="text-xs font-medium">Completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || courseFilter
              ? 'No students match your criteria'
              : 'No students enrolled yet'
            }
          </h3>
          <p className="text-gray-600">
            {searchTerm || courseFilter
              ? 'Try adjusting your search or filter criteria'
              : 'Students will appear here once they enroll in your courses'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;