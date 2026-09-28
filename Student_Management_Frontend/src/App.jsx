import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import MetricsBar from './components/MetricsBar';
import ProgramDistribution from './components/ProgramDistribution';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import InstitutionalPolicyModal from './components/InstitutionalPolicyModal';
import Toast from './components/Toast';
import { studentService } from './services/studentService';
import './App.css';

export default function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('registry_theme') || 'light';
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
  const [deletingBatchIds, setDeletingBatchIds] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Institutional Policy Modal state (privacy or tos)
  const [activePolicyModal, setActivePolicyModal] = useState(null);

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
    localStorage.setItem('registry_theme', theme);
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
        console.error('Data retrieval failed:', err);
        setIsBackendHealthy(false);
        addToast(
          'error',
          'Database Connection Notice',
          err.message || 'Unable to communicate with the Spring Boot backend on port 8080.'
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
    }, 300);
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
          'Record Updated',
          `Student record for "${updated.name}" (#${updated.id}) has been updated.`
        );
      } else {
        // Create
        const created = await studentService.createStudent(formData);
        addToast(
          'success',
          'Registration Confirmed',
          `Student "${created.name}" was successfully registered with Record ID #${created.id}.`
        );
      }
      setIsFormModalOpen(false);
      setEditingStudent(null);
      await fetchData(false);
    } catch (err) {
      console.error('Submission failed:', err);
      addToast('error', 'Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete single student handler
  const handleConfirmDelete = async (target) => {
    setIsDeleting(true);
    try {
      if (Array.isArray(target)) {
        // Batch delete
        await Promise.all(target.map((id) => studentService.deleteStudent(id)));
        addToast(
          'info',
          'Batch Deletion Complete',
          `Successfully removed ${target.length} student record(s) from the registry.`
        );
        setDeletingBatchIds(null);
      } else {
        // Single delete
        await studentService.deleteStudent(target);
        addToast(
          'info',
          'Record Deleted',
          `Student record #${target} was permanently removed from PostgreSQL.`
        );
        setDeletingStudent(null);
      }
      await fetchData(false);
    } catch (err) {
      console.error('Deletion error:', err);
      addToast('error', 'Deletion Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="registry-app">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Institutional Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setEditingStudent(null);
          setIsFormModalOpen(true);
        }}
        isBackendHealthy={isBackendHealthy}
        onPrint={handlePrintRoster}
      />

      {/* Main Workspace */}
      <main className="registry-main">
        <div className="registry-container">
          {/* Institutional Section Header */}
          <div className="registry-section-header no-print">
            <div className="section-title-wrap">
              <h1 className="section-title">
                Academic Student Directory
              </h1>
              <p className="section-subtitle">
                Official institutional roster, enrollment records, and PostgreSQL database registry.
              </p>
            </div>
          </div>

          {/* Administrative Metric Strip */}
          <MetricsBar
            stats={stats}
            totalFiltered={students.length}
            totalCourses={courses.length}
          />

          {/* Academic Program Distribution */}
          {stats?.courseDistribution && (
            <ProgramDistribution
              courseDistribution={stats.courseDistribution}
              totalStudents={stats.totalStudents}
              selectedCourse={selectedCourse}
              onSelectCourse={handleCourseChange}
            />
          )}

          {/* Student Table & Operations */}
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
            onBatchDelete={(ids) => setDeletingBatchIds(ids)}
            onRefresh={() => fetchData(true)}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Institutional Legal Footer */}
      <footer className="registry-footer no-print">
        <div className="registry-footer-inner">
          <div className="footer-meta-block">
            <div className="footer-authority">
              Office of the University Registrar | Student Information System
            </div>
            <div className="footer-copyright">
              © 2026 Academic Records Administration. All rights reserved.
            </div>
          </div>

          <div className="footer-compliance-links">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="footer-link-action"
            >
              FERPA & Privacy Policy
            </button>
            <span className="footer-separator">|</span>
            <button
              onClick={() => setActivePolicyModal('tos')}
              className="footer-link-action"
            >
              Terms of Service
            </button>
            <span className="footer-separator">|</span>
            <span className="footer-tech-spec">
              Spring Boot 3.3.4 • PostgreSQL 18 • React 19
            </span>
          </div>
        </div>
      </footer>

      {/* Student Form Modal (Create or Edit) */}
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

      {/* Student Detail View Modal */}
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

      {/* Delete Confirmation Modal (Single or Batch) */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent || deletingBatchIds)}
        student={deletingStudent}
        batchIds={deletingBatchIds}
        onClose={() => {
          setDeletingStudent(null);
          setDeletingBatchIds(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Institutional Privacy & Terms of Service Modal */}
      <InstitutionalPolicyModal
        isOpen={Boolean(activePolicyModal)}
        type={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
      />
    </div>
  );
}
