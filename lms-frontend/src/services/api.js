import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Courses API
export const coursesAPI = {
  getPublishedCourses: (params) => api.get('/courses/public', { params }),
  searchCourses: (params) => api.get('/courses/public/search', { params }),
  getCourseById: (id) => api.get(`/courses/public/${id}`),
  getCourseLessons: (id) => api.get(`/courses/public/${id}/lessons`),
  getCategories: () => Promise.resolve({ data: ['Programming', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design'] }),
  getCourseReviews: (id) => Promise.resolve({ data: [] }),

  // Instructor endpoints
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  getMyCourses: (params) => api.get('/courses/my-courses', { params }),
  submitForApproval: (id) => api.post(`/courses/${id}/submit`),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Lesson management
  addLesson: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  updateLesson: (courseId, lessonId, lessonData) => api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData),
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),

  // Admin endpoints
  adminCreateCourse: (courseData) => api.post('/courses/admin/create', courseData),
  getAllCourses: (params) => api.get('/courses/admin/all', { params }),
  getPendingCourses: (params) => api.get('/courses/admin/pending', { params }),
  approveCourse: (id) => api.post(`/courses/admin/${id}/approve`),
  rejectCourse: (id) => api.post(`/courses/admin/${id}/reject`),
  adminDeleteCourse: (id) => api.delete(`/courses/admin/${id}`),
};

// Enrollments API
export const enrollmentsAPI = {
  enrollInCourse: (courseId) => api.post(`/enrollments/enroll/${courseId}`),
  getMyEnrollments: (params) => api.get('/enrollments/my-enrollments', { params }),
  unenrollFromCourse: (enrollmentId) => api.delete(`/enrollments/${enrollmentId}/unenroll`),
  checkEnrollmentStatus: (courseId) => api.get(`/enrollments/check/${courseId}`),

  // Progress tracking
  markLessonComplete: (courseId, lessonId) => api.post(`/enrollments/progress/${courseId}/lessons/${lessonId}/complete`),
  markLessonIncomplete: (courseId, lessonId) => api.post(`/enrollments/progress/${courseId}/lessons/${lessonId}/incomplete`),
  getCourseProgress: (courseId) => api.get(`/enrollments/progress/${courseId}`),
  getLessonProgress: (courseId, lessonId) => api.get(`/enrollments/progress/${courseId}/lessons/${lessonId}`),

  // Instructor endpoints
  getMyStudents: (params) => api.get('/enrollments/instructor/my-students', { params }),
  getCourseEnrollments: (courseId, params) => api.get(`/enrollments/course/${courseId}`, { params }),

  // Admin endpoints
  getAllEnrollments: (params) => api.get('/enrollments/admin/all', { params }),
  adminDeleteEnrollment: (enrollmentId) => api.delete(`/enrollments/admin/${enrollmentId}`),
};

// Users API
export const usersAPI = {
  getAllUsers: (params) => api.get('/users/admin/all', { params }),
  getActiveUsers: (params) => api.get('/users/admin/active', { params }),
  getUsersByRole: (role, params) => api.get(`/users/admin/by-role/${role}`, { params }),
  getUserById: (id) => api.get(`/users/admin/${id}`),
  updateUser: (id, userData) => api.put(`/users/admin/${id}`, userData),
  deactivateUser: (id) => api.post(`/users/admin/${id}/deactivate`),
  activateUser: (id) => api.post(`/users/admin/${id}/activate`),
  deleteUser: (id) => api.delete(`/users/admin/${id}`),
  checkUsernameAvailability: (username) => api.get(`/users/check-username/${username}`),
  checkEmailAvailability: (email) => api.get(`/users/check-email/${email}`),
};

export default api;