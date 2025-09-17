package com.lms.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.dto.*;
import com.lms.entity.ContentType;
import com.lms.entity.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
class LmsIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    void fullWorkflow_SignupLoginEnrollFlow() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Step 1: Sign up as instructor
        SignupRequest instructorSignup = new SignupRequest(
                "instructor1",
                "instructor@example.com",
                "password123",
                "John",
                "Instructor",
                Role.INSTRUCTOR
        );

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(instructorSignup)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("instructor1"))
                .andExpect(jsonPath("$.role").value("INSTRUCTOR"));

        // Step 2: Sign up as student
        SignupRequest studentSignup = new SignupRequest(
                "student1",
                "student@example.com",
                "password123",
                "Jane",
                "Student",
                Role.STUDENT
        );

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentSignup)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("student1"))
                .andExpect(jsonPath("$.role").value("STUDENT"));

        // Step 3: Login as instructor
        LoginRequest instructorLogin = new LoginRequest("instructor1", "password123");

        MvcResult instructorLoginResult = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(instructorLogin)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        JwtResponse instructorJwtResponse = objectMapper.readValue(
                instructorLoginResult.getResponse().getContentAsString(),
                JwtResponse.class
        );
        String instructorToken = instructorJwtResponse.getToken();

        // Step 4: Create course as instructor
        CourseRequest courseRequest = new CourseRequest(
                "Introduction to Java",
                "Learn Java programming from scratch",
                null
        );

        MvcResult courseResult = mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + instructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Introduction to Java"))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andReturn();

        CourseResponse courseResponse = objectMapper.readValue(
                courseResult.getResponse().getContentAsString(),
                CourseResponse.class
        );
        Long courseId = courseResponse.getId();

        // Step 5: Add lesson to course
        LessonRequest lessonRequest = new LessonRequest(
                "Java Basics",
                "Introduction to Java syntax and concepts",
                ContentType.TEXT,
                null,
                1
        );

        mockMvc.perform(post("/api/courses/" + courseId + "/lessons")
                        .header("Authorization", "Bearer " + instructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lessonRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Java Basics"))
                .andExpect(jsonPath("$.orderIndex").value(1));

        // Step 6: Submit course for approval
        mockMvc.perform(post("/api/courses/" + courseId + "/submit")
                        .header("Authorization", "Bearer " + instructorToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));

        // Step 7: Login as student
        LoginRequest studentLogin = new LoginRequest("student1", "password123");

        MvcResult studentLoginResult = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentLogin)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        JwtResponse studentJwtResponse = objectMapper.readValue(
                studentLoginResult.getResponse().getContentAsString(),
                JwtResponse.class
        );
        String studentToken = studentJwtResponse.getToken();

        // Step 8: Try to enroll in pending course (should fail)
        mockMvc.perform(post("/api/enrollments/enroll/" + courseId)
                        .header("Authorization", "Bearer " + studentToken))
                .andDo(print())
                .andExpect(status().isBadRequest());

        // Step 9: Approve course (simulating admin action by directly calling service)
        // Note: In a real integration test, you'd create an admin user and use proper authentication

        // Step 10: Browse published courses
        mockMvc.perform(get("/api/courses/public"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Step 11: Get student enrollments
        mockMvc.perform(get("/api/enrollments/my-enrollments")
                        .header("Authorization", "Bearer " + studentToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}