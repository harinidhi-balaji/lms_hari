-- Initialize LMS Database
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- Create sample admin user (password: admin123)
-- Note: This is for demo purposes only. In production, create users via the API
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES
  ('admin', 'admin@lms.com', '$2a$10$8K1p/a9Z6M0p7/i8pF7RFO4hF2Q2h8/f4z7k3B9a5C8E6D7A4H1G9', 'Admin', 'User', 'ADMIN', true, NOW(), NOW()),
  ('instructor1', 'instructor1@lms.com', '$2a$10$8K1p/a9Z6M0p7/i8pF7RFO4hF2Q2h8/f4z7k3B9a5C8E6D7A4H1G9', 'John', 'Smith', 'INSTRUCTOR', true, NOW(), NOW()),
  ('student1', 'student1@lms.com', '$2a$10$8K1p/a9Z6M0p7/i8pF7RFO4hF2Q2h8/f4z7k3B9a5C8E6D7A4H1G9', 'Jane', 'Doe', 'STUDENT', true, NOW(), NOW());

-- Create sample courses
INSERT IGNORE INTO courses (title, description, instructor_id, status, created_at, updated_at)
VALUES
  ('Introduction to Java Programming', 'Learn Java from basics to advanced concepts', 2, 'PUBLISHED', NOW(), NOW()),
  ('Web Development with Spring Boot', 'Build modern web applications using Spring Boot', 2, 'PUBLISHED', NOW(), NOW());

-- Create sample lessons
INSERT IGNORE INTO lessons (title, content, content_type, order_index, course_id, created_at, updated_at)
VALUES
  ('Java Basics', 'Introduction to Java syntax, variables, and data types', 'TEXT', 1, 1, NOW(), NOW()),
  ('Object-Oriented Programming', 'Learn about classes, objects, inheritance, and polymorphism', 'TEXT', 2, 1, NOW(), NOW()),
  ('Exception Handling', 'How to handle errors and exceptions in Java', 'TEXT', 3, 1, NOW(), NOW()),
  ('Spring Boot Introduction', 'Getting started with Spring Boot framework', 'TEXT', 1, 2, NOW(), NOW()),
  ('Building REST APIs', 'Create RESTful web services with Spring Boot', 'TEXT', 2, 2, NOW(), NOW());

-- Create sample enrollment
INSERT IGNORE INTO enrollments (student_id, course_id, enrolled_at, updated_at)
VALUES
  (3, 1, NOW(), NOW()),
  (3, 2, NOW(), NOW());

-- Create sample progress
INSERT IGNORE INTO progress (enrollment_id, lesson_id, completed, created_at, updated_at)
VALUES
  (1, 1, true, NOW(), NOW()),
  (1, 2, false, NOW(), NOW()),
  (1, 3, false, NOW(), NOW()),
  (2, 4, true, NOW(), NOW()),
  (2, 5, false, NOW(), NOW());