# LMS API Examples

This document provides comprehensive examples of how to interact with the LMS API using curl commands and includes sample request/response data.

## Base URL
```
Local Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Authentication

### 1. User Registration

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }'
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "active": true,
  "createdAt": "2023-12-01T10:00:00",
  "updatedAt": "2023-12-01T10:00:00"
}
```

### 2. User Login

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

### 3. Get Current User

**Request:**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "active": true,
  "createdAt": "2023-12-01T10:00:00",
  "updatedAt": "2023-12-01T10:00:00"
}
```

## Course Management

### 4. Browse Published Courses (Public)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/courses/public?page=0&size=10&sortBy=createdAt&sortDir=desc"
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Introduction to Java Programming",
      "description": "Learn Java from basics to advanced concepts",
      "instructorName": "Jane Smith",
      "instructorId": 2,
      "status": "PUBLISHED",
      "thumbnailUrl": null,
      "totalLessons": 5,
      "enrollmentCount": 15,
      "createdAt": "2023-12-01T09:00:00",
      "updatedAt": "2023-12-01T11:00:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "ascending": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### 5. Search Courses

**Request:**
```bash
curl -X GET "http://localhost:8080/api/courses/public/search?keyword=java&page=0&size=10"
```

### 6. Get Course Details

**Request:**
```bash
curl -X GET http://localhost:8080/api/courses/public/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Introduction to Java Programming",
  "description": "Learn Java from basics to advanced concepts",
  "instructorName": "Jane Smith",
  "instructorId": 2,
  "status": "PUBLISHED",
  "thumbnailUrl": null,
  "totalLessons": 5,
  "enrollmentCount": 15,
  "createdAt": "2023-12-01T09:00:00",
  "updatedAt": "2023-12-01T11:00:00"
}
```

### 7. Get Course Lessons

**Request:**
```bash
curl -X GET http://localhost:8080/api/courses/public/1/lessons
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Java Basics",
    "content": "Introduction to Java syntax, variables, and data types",
    "contentType": "TEXT",
    "contentUrl": null,
    "orderIndex": 1,
    "courseId": 1,
    "createdAt": "2023-12-01T09:30:00",
    "updatedAt": "2023-12-01T09:30:00"
  },
  {
    "id": 2,
    "title": "Object-Oriented Programming",
    "content": "Learn about classes, objects, inheritance, and polymorphism",
    "contentType": "TEXT",
    "contentUrl": null,
    "orderIndex": 2,
    "courseId": 1,
    "createdAt": "2023-12-01T09:45:00",
    "updatedAt": "2023-12-01T09:45:00"
  }
]
```

## Instructor Operations

### 8. Create Course (Instructor Only)

**Request:**
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_JWT_TOKEN" \
  -d '{
    "title": "Advanced Spring Boot",
    "description": "Master Spring Boot framework with advanced concepts",
    "thumbnailUrl": "https://example.com/thumbnail.jpg"
  }'
```

**Response:**
```json
{
  "id": 2,
  "title": "Advanced Spring Boot",
  "description": "Master Spring Boot framework with advanced concepts",
  "instructorName": "Jane Smith",
  "instructorId": 2,
  "status": "DRAFT",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "totalLessons": 0,
  "enrollmentCount": 0,
  "createdAt": "2023-12-01T14:00:00",
  "updatedAt": "2023-12-01T14:00:00"
}
```

### 9. Get Instructor's Courses

**Request:**
```bash
curl -X GET "http://localhost:8080/api/courses/my-courses?page=0&size=10" \
  -H "Authorization: Bearer INSTRUCTOR_JWT_TOKEN"
```

### 10. Add Lesson to Course

**Request:**
```bash
curl -X POST http://localhost:8080/api/courses/2/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_JWT_TOKEN" \
  -d '{
    "title": "Spring Boot Fundamentals",
    "content": "Introduction to Spring Boot and its core features",
    "contentType": "TEXT",
    "contentUrl": null,
    "orderIndex": 1
  }'
```

**Response:**
```json
{
  "id": 3,
  "title": "Spring Boot Fundamentals",
  "content": "Introduction to Spring Boot and its core features",
  "contentType": "TEXT",
  "contentUrl": null,
  "orderIndex": 1,
  "courseId": 2,
  "createdAt": "2023-12-01T14:15:00",
  "updatedAt": "2023-12-01T14:15:00"
}
```

### 11. Submit Course for Approval

**Request:**
```bash
curl -X POST http://localhost:8080/api/courses/2/submit \
  -H "Authorization: Bearer INSTRUCTOR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 2,
  "title": "Advanced Spring Boot",
  "description": "Master Spring Boot framework with advanced concepts",
  "instructorName": "Jane Smith",
  "instructorId": 2,
  "status": "PENDING",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "totalLessons": 1,
  "enrollmentCount": 0,
  "createdAt": "2023-12-01T14:00:00",
  "updatedAt": "2023-12-01T14:20:00"
}
```

## Student Operations

### 12. Enroll in Course

**Request:**
```bash
curl -X POST http://localhost:8080/api/enrollments/enroll/1 \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "John Doe",
  "courseId": 1,
  "courseTitle": "Introduction to Java Programming",
  "completedLessons": 0,
  "totalLessons": 5,
  "progressPercentage": 0.0,
  "enrolledAt": "2023-12-01T15:00:00"
}
```

### 13. Get Student Enrollments

**Request:**
```bash
curl -X GET "http://localhost:8080/api/enrollments/my-enrollments?page=0&size=10" \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "studentId": 1,
      "studentName": "John Doe",
      "courseId": 1,
      "courseTitle": "Introduction to Java Programming",
      "completedLessons": 2,
      "totalLessons": 5,
      "progressPercentage": 40.0,
      "enrolledAt": "2023-12-01T15:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### 14. Mark Lesson as Complete

**Request:**
```bash
curl -X POST http://localhost:8080/api/enrollments/progress/1/lessons/1/complete \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "completed": true,
  "createdAt": "2023-12-01T15:00:00",
  "updatedAt": "2023-12-01T15:30:00",
  "completedAt": "2023-12-01T15:30:00"
}
```

### 15. Get Course Progress

**Request:**
```bash
curl -X GET http://localhost:8080/api/enrollments/progress/1 \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "completed": true,
    "createdAt": "2023-12-01T15:00:00",
    "updatedAt": "2023-12-01T15:30:00",
    "completedAt": "2023-12-01T15:30:00",
    "lesson": {
      "id": 1,
      "title": "Java Basics",
      "orderIndex": 1
    }
  },
  {
    "id": 2,
    "completed": false,
    "createdAt": "2023-12-01T15:00:00",
    "updatedAt": "2023-12-01T15:00:00",
    "completedAt": null,
    "lesson": {
      "id": 2,
      "title": "Object-Oriented Programming",
      "orderIndex": 2
    }
  }
]
```

## Admin Operations

### 16. Get Pending Course Approvals

**Request:**
```bash
curl -X GET "http://localhost:8080/api/courses/admin/pending?page=0&size=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "content": [
    {
      "id": 2,
      "title": "Advanced Spring Boot",
      "description": "Master Spring Boot framework with advanced concepts",
      "instructorName": "Jane Smith",
      "instructorId": 2,
      "status": "PENDING",
      "thumbnailUrl": "https://example.com/thumbnail.jpg",
      "totalLessons": 1,
      "enrollmentCount": 0,
      "createdAt": "2023-12-01T14:00:00",
      "updatedAt": "2023-12-01T14:20:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### 17. Approve Course

**Request:**
```bash
curl -X POST http://localhost:8080/api/courses/admin/2/approve \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 2,
  "title": "Advanced Spring Boot",
  "description": "Master Spring Boot framework with advanced concepts",
  "instructorName": "Jane Smith",
  "instructorId": 2,
  "status": "PUBLISHED",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "totalLessons": 1,
  "enrollmentCount": 0,
  "createdAt": "2023-12-01T14:00:00",
  "updatedAt": "2023-12-01T16:00:00"
}
```

### 18. Get All Users

**Request:**
```bash
curl -X GET "http://localhost:8080/api/users/admin/all?page=0&size=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@lms.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "active": true,
      "createdAt": "2023-12-01T08:00:00",
      "updatedAt": "2023-12-01T08:00:00"
    },
    {
      "id": 2,
      "username": "instructor1",
      "email": "instructor1@lms.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "INSTRUCTOR",
      "active": true,
      "createdAt": "2023-12-01T08:30:00",
      "updatedAt": "2023-12-01T08:30:00"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "username": "Username is required",
    "email": "Invalid email format"
  },
  "timestamp": "2023-12-01T10:30:00"
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is expired",
  "path": "/api/courses"
}
```

### 403 Forbidden
```json
{
  "status": 403,
  "message": "Access denied",
  "timestamp": "2023-12-01T10:30:00"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "message": "Course not found with id : '999'",
  "timestamp": "2023-12-01T10:30:00"
}
```

## Environment Variables for Production

```bash
# Database
export DB_HOST=your-db-host
export DB_PORT=3306
export DB_NAME=lms_db
export DB_USERNAME=your-username
export DB_PASSWORD=your-password

# JWT
export JWT_SECRET=your-very-long-secret-key-at-least-32-characters

# File Upload
export UPLOAD_DIR=/app/uploads

# Spring Profile
export SPRING_PROFILES_ACTIVE=production
```

## Postman Collection

You can import these API examples into Postman by creating a new collection and adding requests with the above curl commands. Make sure to:

1. Set up environment variables for:
   - `baseUrl`: http://localhost:8080/api
   - `adminToken`: JWT token for admin user
   - `instructorToken`: JWT token for instructor user
   - `studentToken`: JWT token for student user

2. Add authorization headers automatically using Postman's Authorization tab

3. Set up pre-request scripts to automatically refresh tokens when they expire

## Testing Workflow

Here's a complete testing workflow:

1. **Register users** (admin, instructor, student)
2. **Login as instructor** and create a course
3. **Add lessons** to the course
4. **Submit course** for approval
5. **Login as admin** and approve the course
6. **Login as student** and enroll in the course
7. **Mark lessons** as complete to track progress
8. **View analytics** and manage users as admin

This workflow demonstrates all major features of the LMS system.