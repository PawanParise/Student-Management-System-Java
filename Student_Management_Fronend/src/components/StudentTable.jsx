import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  RefreshCw,
  Mail,
  GraduationCap
} from 'lucide-react';

// Generates a deterministic sleek gradient avatar from the student's name
function getAvatarGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function StudentTable({
  students = [],
  courses = [],
  searchQuery = '',
  onSearchChange,
  selectedCourse = '',
  onCourseChange,
  onOpenCreateModal,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onRefresh,
  isLoading = false,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortDirection]);

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (!students || students.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Age', 'Course', 'CreatedAt'];
    const rows = sortedStudents.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      s.age,
      `"${s.course.replace(/"/g, '""')}"`,
      s.createdAt || '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `student_roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="sort-icon-inactive" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="sort-icon-active" />
    ) : (
      <ArrowDown size={14} className="sort-icon-active" />
    );
  };

  return (
    <div className="table-wrapper-card">
      {/* Controls Bar */}
      <div className="table-controls-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="student-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter and Actions Toolbar */}
        <div className="table-toolbar-right">
          {/* Course filter select */}
          <div className="filter-select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              className="filter-select"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              id="course-filter-select"
            >
              <option value="ALL">All Streams</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            title="Export student records to CSV"
            disabled={students.length === 0}
            id="export-csv-btn"
          >
            <Download size={16} />
            <span className="btn-text-desktop">Export CSV</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            className={`btn-icon ${isLoading ? 'rotating' : ''}`}
            title="Refresh student records"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-responsive-container">
        <table className="student-table" id="student-data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="cursor-pointer">
                <div className="th-content">
                  <span>ID</span>
                  {renderSortIcon('id')}
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="th-content">
                  <span>Student Profile</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('age')} className="cursor-pointer">
                <div className="th-content">
                  <span>Age</span>
                  {renderSortIcon('age')}
                </div>
              </th>
              <th onClick={() => handleSort('course')} className="cursor-pointer">
                <div className="th-content">
                  <span>Course / Stream</span>
                  {renderSortIcon('course')}
                </div>
              </th>
              <th onClick={() => handleSort('createdAt')} className="cursor-pointer">
                <div className="th-content">
                  <span>Enrolled Date</span>
                  {renderSortIcon('createdAt')}
                </div>
              </th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  <td><div className="skeleton skeleton-id"></div></td>
                  <td>
                    <div className="skeleton-profile">
                      <div className="skeleton skeleton-avatar"></div>
                      <div className="skeleton-info">
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-subtext"></div>
                      </div>
                    </div>
                  </td>
                  <td><div className="skeleton skeleton-badge"></div></td>
                  <td><div className="skeleton skeleton-badge"></div></td>
                  <td><div className="skeleton skeleton-date"></div></td>
                  <td><div className="skeleton skeleton-actions"></div></td>
                </tr>
              ))
            ) : sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state-cell">
                  <div className="empty-state-card">
                    <div className="empty-icon-circle">
                      <GraduationCap size={32} className="text-accent" />
                    </div>
                    <h3 className="empty-state-title">No Students Found</h3>
                    <p className="empty-state-desc">
                      {searchQuery || (selectedCourse && selectedCourse !== 'ALL')
                        ? 'No students matched your search criteria. Try resetting filters.'
                        : 'No students have been registered yet in PostgreSQL.'}
                    </p>
                    <div className="empty-state-actions">
                      {searchQuery || (selectedCourse && selectedCourse !== 'ALL') ? (
                        <button
                          onClick={() => {
                            onSearchChange('');
                            onCourseChange('ALL');
                          }}
                          className="btn-secondary"
                        >
                          Reset Filters
                        </button>
                      ) : (
                        <button onClick={onOpenCreateModal} className="btn-primary">
                          <UserPlus size={16} />
                          <span>Enroll First Student</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStudents.map((student) => (
                <tr key={student.id} className="student-table-row">
                  {/* ID */}
                  <td>
                    <span className="student-id-tag">#{student.id}</span>
                  </td>

                  {/* Profile */}
                  <td>
                    <div className="student-profile-cell">
                      <div
                        className="student-avatar"
                        style={{ background: getAvatarGradient(student.name) }}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-email">
                          <Mail size={12} style={{ marginRight: '4px' }} />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td>
                    <span className="age-badge">{student.age} yrs</span>
                  </td>

                  {/* Course */}
                  <td>
                    <span className="course-pill">
                      <GraduationCap size={13} style={{ marginRight: '5px' }} />
                      {student.course}
                    </span>
                  </td>

                  {/* Enrolled Date */}
                  <td>
                    <span className="date-text">{formatDate(student.createdAt)}</span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-buttons-group">
                      <button
                        onClick={() => onViewStudent(student)}
                        className="btn-action btn-view"
                        title="View Student Profile"
                        id={`view-btn-${student.id}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        className="btn-action btn-edit"
                        title="Edit Student"
                        id={`edit-btn-${student.id}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(student)}
                        className="btn-action btn-delete"
                        title="Delete Student"
                        id={`delete-btn-${student.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Status */}
      <div className="table-footer-status">
        <span>
          Showing <strong>{sortedStudents.length}</strong> of{' '}
          <strong>{students.length}</strong> student record(s)
        </span>
        {selectedCourse && selectedCourse !== 'ALL' && (
          <span className="filtered-notice">
            Filtered by course: <em>{selectedCourse}</em>
          </span>
        )}
      </div>
    </div>
  );
}
