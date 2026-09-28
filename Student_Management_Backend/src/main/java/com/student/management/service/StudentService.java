package com.student.management.service;

import com.student.management.dto.DashboardStatsDto;
import com.student.management.dto.StudentDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StudentService {

    List<StudentDto> getAllStudents(String search, String course);

    Page<StudentDto> getStudentsPaged(String search, String course, int page, int size, String sortBy, String direction);

    StudentDto getStudentById(Long id);

    StudentDto createStudent(StudentDto studentDto);

    StudentDto updateStudent(Long id, StudentDto studentDto);

    void deleteStudent(Long id);

    DashboardStatsDto getDashboardStats();

    List<String> getAllCourses();
}
