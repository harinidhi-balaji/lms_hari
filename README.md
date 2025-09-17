# Learning Management System (LMS)

A full-stack Learning Management System built with Spring Boot, React, and MySQL. This system supports role-based access for students, instructors, and administrators with comprehensive course management and progress tracking features.

## 🚀 Features

### For Students
- Browse and search published courses
- Enroll in courses with progress tracking
- View course content and lessons
- Track learning progress per lesson
- Responsive dashboard with enrollment overview

### For Instructors
- Create and manage courses
- Add lessons with different content types (Text, Video, PDF)
- Submit courses for admin approval
- View enrolled students and their progress
- Course analytics and statistics

### For Administrators
- Approve or reject course submissions
- Manage users (view, activate, deactivate)
- System-wide analytics and reporting
- Course and user management

## 🛠 Technology Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **JWT** - Token-based authentication
- **MySQL 8.0** - Database
- **Swagger/OpenAPI** - API documentation
- **JUnit 5 + Mockito** - Testing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### DevOps
- **Docker & Docker Compose** - Containerization
- **Maven** - Build automation

## 📁 Project Structure

```
lms/
├── lms-backend/              # Spring Boot backend
│   ├── src/main/java/com/lms/
│   │   ├── config/           # Security, Swagger configuration
│   │   ├── controller/       # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global exception handling
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   └── util/            # Utility classes
│   ├── src/main/resources/  # Configuration files
│   ├── src/test/           # Unit and integration tests
│   ├── uploads/            # File storage directory
│   ├── Dockerfile          # Docker configuration
│   └── pom.xml            # Maven dependencies
├── lms-frontend/           # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # NPM dependencies
├── mysql-init/            # Database initialization scripts
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## 🚦 Quick Start

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0+** (or Docker)
- **Maven 3.6+**

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd lms
   ```

2. **Start the application with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - MySQL database on port 3306
   - Spring Boot backend on port 8080
   - phpMyAdmin on port 8081 (optional)

3. **Access the applications:**
   - **Backend API:** http://localhost:8080
   - **Swagger UI:** http://localhost:8080/swagger-ui.html
   - **phpMyAdmin:** http://localhost:8081

4. **Start the React frontend:**
   ```bash
   cd lms-frontend
   npm install
   npm run dev
   ```
   - **Frontend:** http://localhost:3000

### Option 2: Local Development Setup

#### Backend Setup

1. **Install MySQL and create database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE lms_db;
   CREATE USER 'lmsuser'@'localhost' IDENTIFIED BY 'lmspassword';
   GRANT ALL PRIVILEGES ON lms_db.* TO 'lmsuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Navigate to backend directory and run:**
   ```bash
   cd lms-backend
   ./mvnw spring-boot:run
   ```

   Or with custom database settings:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.datasource.username=yourusername --spring.datasource.password=yourpassword
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd lms-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🧪 Running Tests

### Backend Tests
```bash
cd lms-backend
./mvnw test
```

### Frontend Tests
```bash
cd lms-frontend
npm test
```

## 🏗 Building for Production

### Backend
```bash
cd lms-backend
./mvnw clean package
```
The JAR file will be generated in `target/` directory.

### Frontend
```bash
cd lms-frontend
npm run build
```
The build files will be generated in `dist/` directory.

## 🌐 Deployment Guide

### Deploy Backend to Railway

1. **Create a Railway account** at https://railway.app

2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login and deploy:**
   ```bash
   cd lms-backend
   railway login
   railway project create
   railway up
   ```

4. **Set environment variables in Railway dashboard:**
   ```
   DB_HOST=<railway-mysql-host>
   DB_PORT=3306
   DB_NAME=railway
   DB_USERNAME=<railway-mysql-username>
   DB_PASSWORD=<railway-mysql-password>
   JWT_SECRET=<your-jwt-secret-key>
   SPRING_PROFILES_ACTIVE=production
   ```

### Deploy Backend to Render

1. **Create a Render account** at https://render.com

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Build Command: `./mvnw clean package`
   - Start Command: `java -jar target/lms-backend-1.0.0.jar`
   - Environment: Java 17

3. **Set environment variables:**
   ```
   DB_HOST=<render-postgres-host>
   DB_PORT=5432
   DB_NAME=<database-name>
   DB_USERNAME=<database-username>
   DB_PASSWORD=<database-password>
   JWT_SECRET=<your-jwt-secret-key>
   SPRING_PROFILES_ACTIVE=production
   ```

### Deploy Frontend to Netlify

1. **Build the frontend:**
   ```bash
   cd lms-frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to https://app.netlify.com
   - Or connect your GitHub repository for automatic deployments

3. **Set environment variables:**
   ```
   VITE_API_URL=<your-backend-url>/api
   ```

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd lms-frontend
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   ```
   VITE_API_URL=<your-backend-url>/api
   ```

## 🔧 Configuration

### Backend Configuration (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lms_db
    username: ${DB_USERNAME:lmsuser}
    password: ${DB_PASSWORD:lmspassword}

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000

file:
  upload-dir: ${UPLOAD_DIR:./uploads}
```

### Frontend Configuration (.env)

```env
VITE_API_URL=http://localhost:8080/api
```

## 👥 Default Users

The system comes with pre-configured demo accounts:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | System administrator with full access |
| Instructor | `instructor1` | `admin123` | Can create and manage courses |
| Student | `student1` | `admin123` | Can enroll in and access courses |

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/api-docs

### Key API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

#### Courses
- `GET /api/courses/public` - Browse published courses
- `POST /api/courses` - Create course (Instructor)
- `GET /api/courses/my-courses` - Get instructor's courses
- `POST /api/courses/{id}/submit` - Submit for approval

#### Enrollments
- `POST /api/enrollments/enroll/{courseId}` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get student enrollments
- `POST /api/enrollments/progress/{courseId}/lessons/{lessonId}/complete` - Mark lesson complete

#### Admin
- `GET /api/courses/admin/pending` - Get pending course approvals
- `POST /api/courses/admin/{id}/approve` - Approve course
- `GET /api/users/admin/all` - Get all users

## 🔨 Development

### Adding New Features

1. **Backend:**
   - Create entity in `entity/`
   - Add repository in `repository/`
   - Implement service in `service/`
   - Create controller in `controller/`
   - Add DTOs in `dto/`
   - Write tests in `src/test/`

2. **Frontend:**
   - Add components in `components/`
   - Create pages in `pages/`
   - Add API calls in `services/`
   - Update routing in `App.jsx`

### Code Style

- **Backend:** Follow Spring Boot conventions
- **Frontend:** Use functional components with hooks
- **CSS:** Tailwind utility classes
- **Testing:** JUnit 5 for backend, Vitest for frontend

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   ```bash
   # Check MySQL is running
   brew services start mysql  # macOS
   sudo systemctl start mysql  # Linux

   # Verify credentials
   mysql -u lmsuser -p lms_db
   ```

2. **Port Already in Use:**
   ```bash
   # Kill process on port 8080
   lsof -ti:8080 | xargs kill -9

   # Or change port in application.yml
   server.port: 8081
   ```

3. **JWT Token Issues:**
   - Ensure JWT_SECRET is at least 32 characters
   - Check token expiration settings
   - Clear browser localStorage if needed

4. **CORS Issues:**
   - Verify frontend URL in SecurityConfig
   - Check proxy settings in vite.config.js

### Docker Issues

1. **Container won't start:**
   ```bash
   docker-compose logs backend
   docker-compose logs mysql
   ```

2. **Database initialization:**
   ```bash
   docker-compose down -v  # Remove volumes
   docker-compose up -d
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/swagger-ui.html`
- Review the troubleshooting section above

## 🗺 Roadmap

- [ ] Real-time notifications
- [ ] Video streaming integration
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive improvements
- [ ] Bulk operations for admin
- [ ] Course categories and tags
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Payment integration
- [ ] Multi-language support