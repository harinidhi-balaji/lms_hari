import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Student pages
import CourseList from './pages/student/CourseList';
import CourseDetail from './pages/student/CourseDetail';
import MyEnrollments from './pages/student/MyEnrollments';
import MyProgress from './pages/student/MyProgress';

// Instructor pages
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import InstructorStudents from './pages/instructor/InstructorStudents';

// Admin pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AddCourse from './pages/admin/AddCourse';
import CourseApprovals from './pages/admin/CourseApprovals';

// Error pages
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4ade80',
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: '#ef4444',
                },
              },
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CourseList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CourseDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-enrollments"
              element={
                <ProtectedRoute roles={['STUDENT']}>
                  <Layout>
                    <MyEnrollments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-progress"
              element={
                <ProtectedRoute roles={['STUDENT']}>
                  <Layout>
                    <MyProgress />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Instructor routes */}
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute roles={['INSTRUCTOR']}>
                  <Layout>
                    <InstructorCourses />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/new"
              element={
                <ProtectedRoute roles={['INSTRUCTOR']}>
                  <Layout>
                    <CreateCourse />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <ProtectedRoute roles={['INSTRUCTOR']}>
                  <Layout>
                    <EditCourse />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/students"
              element={
                <ProtectedRoute roles={['INSTRUCTOR']}>
                  <Layout>
                    <InstructorStudents />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Layout>
                    <AdminCourses />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/add"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Layout>
                    <AddCourse />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Layout>
                    <CourseApprovals />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;