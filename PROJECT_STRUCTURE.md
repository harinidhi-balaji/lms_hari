# LMS Project Structure

```
lms/
├── README.md                          # Main project documentation
├── api-examples.md                    # API usage examples with curl commands
├── PROJECT_STRUCTURE.md               # This file
├── docker-compose.yml                 # Multi-container Docker setup
├── mysql-init/                        # Database initialization
│   └── 01-init.sql                   # Sample data and database setup
│
├── lms-backend/                       # Spring Boot Backend
│   ├── .mvn/wrapper/                  # Maven wrapper
│   │   ├── maven-wrapper.jar
│   │   └── maven-wrapper.properties
│   ├── mvnw                          # Maven wrapper script (Unix)
│   ├── mvnw.cmd                      # Maven wrapper script (Windows)
│   ├── pom.xml                       # Maven dependencies and build config
│   ├── Dockerfile                    # Backend container definition
│   ├── uploads/                      # File upload directory
│   ├── src/main/java/com/lms/
│   │   ├── LmsBackendApplication.java # Main Spring Boot application
│   │   ├── config/                   # Configuration classes
│   │   │   ├── AuthEntryPointJwt.java
│   │   │   ├── AuthTokenFilter.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── SecurityConfig.java
│   │   │   ├── SwaggerConfig.java
│   │   │   └── UserPrincipal.java
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   ├── CourseController.java # Course management
│   │   │   ├── EnrollmentController.java # Enrollment and progress
│   │   │   └── UserController.java   # User management (Admin)
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── CourseRequest.java
│   │   │   ├── CourseResponse.java
│   │   │   ├── EnrollmentResponse.java
│   │   │   ├── JwtResponse.java
│   │   │   ├── LessonRequest.java
│   │   │   ├── LessonResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── SignupRequest.java
│   │   │   └── UserResponse.java
│   │   ├── entity/                   # JPA Entities
│   │   │   ├── ContentType.java      # Enum for lesson content types
│   │   │   ├── Course.java           # Course entity
│   │   │   ├── CourseStatus.java     # Enum for course statuses
│   │   │   ├── Enrollment.java       # Student-Course relationship
│   │   │   ├── Lesson.java           # Course lesson entity
│   │   │   ├── Progress.java         # Student lesson progress
│   │   │   ├── Role.java             # User role enum
│   │   │   └── User.java             # User entity
│   │   ├── exception/                # Exception handling
│   │   │   ├── BadRequestException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/               # Data Access Layer
│   │   │   ├── CourseRepository.java
│   │   │   ├── EnrollmentRepository.java
│   │   │   ├── LessonRepository.java
│   │   │   ├── ProgressRepository.java
│   │   │   └── UserRepository.java
│   │   ├── service/                  # Business Logic Layer
│   │   │   ├── CourseService.java
│   │   │   ├── EnrollmentService.java
│   │   │   ├── LessonService.java
│   │   │   ├── ProgressService.java
│   │   │   └── UserService.java
│   │   └── util/                     # Utility classes
│   │       └── JwtUtils.java         # JWT token utilities
│   ├── src/main/resources/
│   │   ├── application.yml           # Main configuration
│   │   └── application-production.yml # Production configuration
│   └── src/test/                     # Test classes
│       ├── java/com/lms/
│       │   ├── controller/
│       │   │   └── AuthControllerTest.java
│       │   ├── integration/
│       │   │   └── LmsIntegrationTest.java
│       │   └── service/
│       │       ├── CourseServiceTest.java
│       │       └── UserServiceTest.java
│       └── resources/
│           └── application-test.yml   # Test configuration
│
└── lms-frontend/                      # React Frontend
    ├── package.json                   # NPM dependencies
    ├── vite.config.js                # Vite build configuration
    ├── tailwind.config.js            # Tailwind CSS configuration
    ├── postcss.config.js             # PostCSS configuration
    ├── index.html                    # Main HTML template
    ├── public/                       # Static assets
    ├── src/
    │   ├── main.jsx                  # React app entry point
    │   ├── App.jsx                   # Main app component with routing
    │   ├── index.css                 # Global styles and Tailwind imports
    │   ├── components/               # Reusable UI components
    │   │   ├── Layout.jsx            # Main layout with navigation
    │   │   └── ProtectedRoute.jsx    # Route protection wrapper
    │   ├── contexts/                 # React contexts
    │   │   └── AuthContext.jsx       # Authentication state management
    │   ├── hooks/                    # Custom React hooks
    │   ├── pages/                    # Page components
    │   │   ├── Dashboard.jsx         # Role-based dashboard
    │   │   ├── Login.jsx             # Login page
    │   │   ├── Register.jsx          # Registration page
    │   │   ├── NotFound.jsx          # 404 error page
    │   │   ├── Unauthorized.jsx      # 403 error page
    │   │   ├── admin/                # Admin-specific pages
    │   │   │   ├── AdminCourses.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   └── CourseApprovals.jsx
    │   │   ├── instructor/           # Instructor-specific pages
    │   │   │   ├── CreateCourse.jsx
    │   │   │   ├── EditCourse.jsx
    │   │   │   ├── InstructorCourses.jsx
    │   │   │   └── InstructorStudents.jsx
    │   │   └── student/              # Student-specific pages
    │   │       ├── CourseDetail.jsx
    │   │       ├── CourseList.jsx
    │   │       └── MyEnrollments.jsx
    │   ├── services/                 # API integration
    │   │   └── api.js                # Axios configuration and API endpoints
    │   └── utils/                    # Utility functions
    └── dist/                         # Build output directory (generated)
```

## Key Features by Module

### Backend Modules

#### **Authentication & Security**
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt
- Custom authentication entry point
- Token filter for request validation

#### **User Management**
- User registration and profile management
- Role-based user types (Admin, Instructor, Student)
- User activation/deactivation
- Admin user management interface

#### **Course Management**
- Course creation and editing
- Lesson management with multiple content types
- Course approval workflow
- Status tracking (Draft, Pending, Published, Rejected)

#### **Enrollment & Progress**
- Student course enrollment
- Lesson progress tracking
- Progress percentage calculation
- Enrollment management

#### **Data Layer**
- JPA/Hibernate for ORM
- Custom repository methods
- Database relationships and constraints
- Query optimization

### Frontend Modules

#### **Authentication Flow**
- Login/Register forms with validation
- JWT token management
- Automatic token refresh
- Protected route implementation

#### **Role-Based UI**
- Dynamic navigation based on user role
- Role-specific dashboards
- Permission-based component rendering
- Context-based state management

#### **Course Interface**
- Course browsing and search
- Detailed course view with lessons
- Progress tracking visualization
- Enrollment management

#### **Admin Interface**
- User management dashboard
- Course approval system
- System analytics and reporting
- Bulk operations

#### **Instructor Interface**
- Course creation and management
- Lesson content management
- Student progress monitoring
- Course analytics

#### **Student Interface**
- Course catalog browsing
- Enrollment and progress tracking
- Learning dashboard
- Course content access

## Technology Highlights

### Backend Technologies
- **Spring Boot 3.2.0** - Latest stable version
- **Spring Security 6** - Modern security framework
- **Spring Data JPA** - Simplified data access
- **MySQL 8.0** - Reliable database with modern features
- **JWT (JJWT 0.12.3)** - Secure token implementation
- **OpenAPI/Swagger** - Interactive API documentation
- **JUnit 5 + Mockito** - Comprehensive testing

### Frontend Technologies
- **React 18** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router 6** - Modern client-side routing
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Performant form handling

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **Maven Wrapper** - Consistent build environment
- **Multi-stage Docker builds** - Optimized images
- **Environment-based configuration** - Flexible deployment

## Database Schema

### Core Tables
- **users** - User accounts and profiles
- **courses** - Course information and metadata
- **lessons** - Course content and ordering
- **enrollments** - Student-course relationships
- **progress** - Individual lesson completion tracking

### Relationships
- User 1:N Course (instructor relationship)
- User N:M Course (student enrollment via enrollments table)
- Course 1:N Lesson (course content)
- Enrollment 1:N Progress (progress tracking)

## Security Implementation

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with BCrypt
- Token-based stateless authentication
- Automatic token validation on requests

### Authorization
- Role-based access control (RBAC)
- Method-level security annotations
- Route-level protection in frontend
- API endpoint security mapping

### Data Protection
- Input validation and sanitization
- SQL injection prevention via JPA
- XSS protection with proper escaping
- CORS configuration for cross-origin requests

## API Design Patterns

### REST Principles
- Resource-based URLs
- HTTP method semantics
- Consistent response formats
- Proper status codes

### Error Handling
- Global exception handling
- Standardized error responses
- Validation error formatting
- Client-friendly error messages

### Data Transfer
- DTO pattern for clean API contracts
- Pagination for large datasets
- Query parameter filtering
- Consistent date/time formatting

This structure provides a solid foundation for a production-ready Learning Management System with clear separation of concerns, maintainable code architecture, and modern development practices.