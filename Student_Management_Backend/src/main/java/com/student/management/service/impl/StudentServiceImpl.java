package com.student.management.service.impl;

import com.student.management.dto.DashboardStatsDto;
import com.student.management.dto.StudentDto;
import com.student.management.exception.DuplicateResourceException;
import com.student.management.exception.ResourceNotFoundException;
import com.student.management.model.Student;
import com.student.management.repository.StudentRepository;
import com.student.management.service.StudentService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    private Specification<Student> buildSearchSpecification(String search, String course) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), pattern);
                predicates.add(cb.or(nameMatch, emailMatch));
            }

            if (course != null && !course.trim().isEmpty() && !course.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(root.get("course"), course.trim()));
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents(String search, String course) {
        Specification<Student> spec = buildSearchSpecification(search, course);
        List<Student> students = studentRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "id"));
        return students.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDto> getStudentsPaged(String search, String course, int page, int size, String sortBy, String direction) {
        Specification<Student> spec = buildSearchSpecification(search, course);
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(dir, (sortBy != null && !sortBy.trim().isEmpty()) ? sortBy : "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Student> studentPage = studentRepository.findAll(spec, pageable);
        return studentPage.map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        if (studentRepository.existsByEmail(studentDto.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("A student with email '" + studentDto.getEmail().trim() + "' already exists.");
        }

        Student student = new Student();
        student.setName(studentDto.getName().trim());
        student.setEmail(studentDto.getEmail().trim().toLowerCase());
        student.setAge(studentDto.getAge());
        student.setCourse(studentDto.getCourse().trim());

        Student saved = studentRepository.save(student);
        return mapToDto(saved);
    }

    @Override
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String normalizedEmail = studentDto.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
            throw new DuplicateResourceException("Another student is already registered with email: " + normalizedEmail);
        }

        existing.setName(studentDto.getName().trim());
        existing.setEmail(normalizedEmail);
        existing.setAge(studentDto.getAge());
        existing.setCourse(studentDto.getCourse().trim());

        Student updated = studentRepository.save(existing);
        return mapToDto(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        Double avgAge = studentRepository.getAverageAge();
        double averageAge = avgAge != null ? Math.round(avgAge * 10.0) / 10.0 : 0.0;

        List<Object[]> courseCounts = studentRepository.countStudentsByCourse();
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Object[] row : courseCounts) {
            if (row != null && row.length >= 2 && row[0] != null) {
                distribution.put((String) row[0], ((Number) row[1]).longValue());
            }
        }

        List<StudentDto> latest = studentRepository.findTop5ByOrderByIdDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new DashboardStatsDto(totalStudents, averageAge, distribution, latest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCourses() {
        return studentRepository.findDistinctCourses();
    }

    private StudentDto mapToDto(Student student) {
        return new StudentDto(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getAge(),
                student.getCourse(),
                student.getCreatedAt()
        );
    }
}
