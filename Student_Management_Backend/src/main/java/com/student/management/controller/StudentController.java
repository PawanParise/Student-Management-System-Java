package com.student.management.controller;

import com.student.management.dto.DashboardStatsDto;
import com.student.management.dto.StudentDto;
import com.student.management.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
@Tag(name = "Student Controller", description = "REST APIs for Managing Students and Dashboard Statistics")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "Get all students with optional search and course filtering")
    public ResponseEntity<List<StudentDto>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String course) {
        List<StudentDto> students = studentService.getAllStudents(search, course);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/paged")
    @Operation(summary = "Get students with pagination and sorting")
    public ResponseEntity<Page<StudentDto>> getStudentsPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String course,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<StudentDto> paged = studentService.getStudentsPaged(search, course, page, size, sortBy, direction);
        return ResponseEntity.ok(paged);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student details by ID")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PostMapping
    @Operation(summary = "Register a new student")
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody StudentDto studentDto) {
        StudentDto created = studentService.createStudent(studentDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student by ID")
    public ResponseEntity<StudentDto> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDto studentDto) {
        StudentDto updated = studentService.updateStudent(id, studentDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete student by ID")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        response.put("message", "Student with ID " + id + " was deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get aggregated statistics for dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = studentService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/courses")
    @Operation(summary = "Get distinct course list")
    public ResponseEntity<List<String>> getAllCourses() {
        List<String> courses = studentService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
}
