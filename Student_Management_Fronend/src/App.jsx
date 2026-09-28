import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import CourseBreakdown from './components/CourseBreakdown';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { studentService } from './services/studentService';
import './App.css';

export default function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edupulse_theme') || 'dark';
  });

  // Data states
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [detailStudent, setDetailStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edupulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch all data
  const fetchData = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const [studentList, statsData, courseList] = await Promise.all([
          studentService.getStudents(searchQuery, selectedCourse),
          studentService.getStats(),
          studentService.getCourses(),
        ]);

        setStudents(studentList || []);
        setStats(statsData || null);
        setCourses(courseList || []);
        setIsBackendHealthy(true);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setIsBackendHealthy(false);
        addToast(
          'error',
          'Backend Connection Error',
          err.message || 'Could not connect to Spring Boot API on port 8080.'
        );
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [searchQuery, selectedCourse, addToast]
  );

  // Debounced search trigger
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchData(false);
    }, 280);
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
  };

  // Trigger load on filter change or mount
  useEffect(() => {
    fetchData(true);
  }, [selectedCourse]);

  // Periodic health check ping every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const healthy = await studentService.checkHealth();
      setIsBackendHealthy(healthy);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Form submit handler (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent && editingStudent.id) {
        // Update
        const updated = await studentService.updateStudent(
          editingStudent.id,
          formData
        );
        addToast(
          'success',
          'Student Updated',
          `Student "${updated.name}" was updated successfully.`
        );
      } else {
        // Create
        const created = await studentService.createStudent(formData);
        addToast(
          'success',
          'Student Enrolled',
          `Student "${created.name}" enrolled with ID #${created.id}.`
        );
      }
      setIsFormModalOpen(false);
      setEditingStudent(null);
      await fetchData(false);
    } catch (err) {
      console.error('Save failed:', err);
      addToast('error', 'Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(id);
      addToast(
        'info',
        'Student Removed',
        `Student record #${id} was deleted from database.`
      );
      setDeletingStudent(null);
      await fetchData(false);
    } catch (err) {
      console.error('Delete failed:', err);
      addToast('error', 'Deletion Error', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Top Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setEditingStudent(null);
          setIsFormModalOpen(true);
        }}
        isBackendHealthy={isBackendHealthy}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-text-wrap">
              <h1 className="hero-title">
                Academic Roster & <span className="gradient-text">Student Directory</span>
              </h1>
              <p className="hero-subtitle">
                Manage student enrollment, monitor academic cohorts, and query PostgreSQL in real-time.
              </p>
            </div>
          </section>

          {/* KPI Stat Cards */}
          <StatsCards
            stats={stats}
            totalFiltered={students.length}
            totalCourses={courses.length}
          />

          {/* Course Distribution Visual Breakdown */}
          {stats?.courseDistribution && (
            <CourseBreakdown
              courseDistribution={stats.courseDistribution}
              totalStudents={stats.totalStudents}
              selectedCourse={selectedCourse}
              onSelectCourse={handleCourseChange}
            />
          )}

          {/* Student Table & Filter Tools */}
          <StudentTable
            students={students}
            courses={courses}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseChange}
            onOpenCreateModal={() => {
              setEditingStudent(null);
              setIsFormModalOpen(true);
            }}
            onViewStudent={(student) => setDetailStudent(student)}
            onEditStudent={(student) => {
              setEditingStudent(student);
              setIsFormModalOpen(true);
            }}
            onDeleteStudent={(student) => setDeletingStudent(student)}
            onRefresh={() => fetchData(true)}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-inner">
          <div className="footer-left">
            <span>EduPulse Student Management System</span>
            <span className="footer-dot">•</span>
            <span className="footer-sub">Spring Boot 3.3.4 + React + PostgreSQL 18</span>
          </div>
          <div className="footer-tech-stack">
            <span className="tech-badge">Java 21</span>
            <span className="tech-badge">Spring Data JPA</span>
            <span className="tech-badge">PostgreSQL</span>
            <span className="tech-badge">Vite + React</span>
            <span className="tech-badge">REST API</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
        isSubmitting={isSubmitting}
        availableCourses={courses}
      />

      {/* Student Profile Quick View Modal */}
      <StudentDetailModal
        isOpen={Boolean(detailStudent)}
        student={detailStudent}
        onClose={() => setDetailStudent(null)}
        onEdit={(student) => {
          setDetailStudent(null);
          setEditingStudent(student);
          setIsFormModalOpen(true);
        }}
        onDelete={(student) => {
          setDetailStudent(null);
          setDeletingStudent(student);
        }}
      />

      {/* Safe Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        student={deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
