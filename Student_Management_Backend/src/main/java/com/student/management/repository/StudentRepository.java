package com.student.management.repository;

import com.student.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT DISTINCT s.course FROM Student s WHERE s.course IS NOT NULL ORDER BY s.course ASC")
    List<String> findDistinctCourses();

    @Query("SELECT s.course, COUNT(s) FROM Student s GROUP BY s.course")
    List<Object[]> countStudentsByCourse();

    @Query("SELECT AVG(s.age) FROM Student s")
    Double getAverageAge();

    List<Student> findTop5ByOrderByIdDesc();
}
