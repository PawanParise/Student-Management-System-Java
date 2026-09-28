import React, { useState, useMemo } from 'react';
import {
  IconSearch,
  IconClose,
  IconFilter,
  IconDownload,
  IconPrinter,
  IconRefresh,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconSortDefault,
  IconSortAsc,
  IconSortDesc,
  IconChevronLeft,
  IconChevronRight,
  IconCheck
} from './Icons';

function formatDate(dateStr) {
  if (!dateStr) return 'Not recorded';
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
  onBatchDelete,
  onRefresh,
  isLoading = false,
}) {
  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Age filter state
  const [ageFilter, setAgeFilter] = useState('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Row selection state for batch actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filter students by Search, Course, and Age
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search matching name, email, or ID
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (s.name || '').toLowerCase().includes(q);
        const matchesEmail = (s.email || '').toLowerCase().includes(q);
        const matchesId = String(s.id).includes(q);
        if (!matchesName && !matchesEmail && !matchesId) return false;
      }

      // Course filter
      if (selectedCourse && selectedCourse !== 'ALL') {
        if (s.course !== selectedCourse) return false;
      }

      // Age filter
      if (ageFilter !== 'ALL') {
        const age = Number(s.age);
        if (ageFilter === 'UNDER_20' && age >= 20) return false;
        if (ageFilter === '20_25' && (age < 20 || age > 25)) return false;
        if (ageFilter === 'OVER_25' && age <= 25) return false;
      }

      return true;
    });
  }, [students, searchQuery, selectedCourse, ageFilter]);

  // Sort filtered students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortDirection]);

  // Pagination calculation
  const totalRecords = sortedStudents.length;
  const effectivePageSize = pageSize === 'ALL' ? totalRecords || 1 : Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(totalRecords / effectivePageSize));

  // Current page records
  const paginatedStudents = useMemo(() => {
    if (pageSize === 'ALL') return sortedStudents;
    const start = (currentPage - 1) * effectivePageSize;
    return sortedStudents.slice(start, start + effectivePageSize);
  }, [sortedStudents, currentPage, effectivePageSize, pageSize]);

  // Handle Select All on current page
  const allCurrentPageSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedIds.has(s.id));

  const toggleSelectAll = () => {
    const updated = new Set(selectedIds);
    if (allCurrentPageSelected) {
      paginatedStudents.forEach((s) => updated.delete(s.id));
    } else {
      paginatedStudents.forEach((s) => updated.add(s.id));
    }
    setSelectedIds(updated);
  };

  const toggleSelectRow = (id) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Export to CSV
  const handleExportCSV = (exportSelectedOnly = false) => {
    const targetStudents = exportSelectedOnly
      ? sortedStudents.filter((s) => selectedIds.has(s.id))
      : sortedStudents;

    if (!targetStudents || targetStudents.length === 0) return;

    const headers = ['Record_ID', 'Student_Name', 'Email_Address', 'Age', 'Academic_Program', 'Enrollment_Date', 'Status'];
    const rows = targetStudents.map((s) => [
      s.id,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      s.age,
      `"${(s.course || '').replace(/"/g, '""')}"`,
      s.createdAt || '',
      'Active',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `academic_roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Roster
  const handlePrint = () => {
    window.print();
  };

  // Render Sort Icon
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <IconSortDefault size={13} className="sort-icon-default" />;
    }
    return sortDirection === 'asc' ? (
      <IconSortAsc size={13} className="sort-icon-active" />
    ) : (
      <IconSortDesc size={13} className="sort-icon-active" />
    );
  };

  // Reset all filters
  const resetFilters = () => {
    onSearchChange('');
    onCourseChange('ALL');
    setAgeFilter('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    (selectedCourse && selectedCourse !== 'ALL') ||
    ageFilter !== 'ALL';

  return (
    <div className="table-wrapper-card">
      {/* Search and Query Filter Bar */}
      <div className="table-filter-bar no-print">
        {/* Search Input */}
        <div className="search-field-container">
          <IconSearch size={15} className="search-field-icon" />
          <input
            type="text"
            className="search-field-input"
            placeholder="Search by student name, email, or record ID..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            id="student-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-action"
              onClick={() => {
                onSearchChange('');
                setCurrentPage(1);
              }}
              title="Clear search text"
              aria-label="Clear search"
            >
              <IconClose size={13} />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="filter-controls-group">
          {/* Course Program Selector */}
          <div className="select-container">
            <label htmlFor="course-filter-select" className="filter-label">Program:</label>
            <select
              className="filter-select-element"
              value={selectedCourse}
              onChange={(e) => {
                onCourseChange(e.target.value);
                setCurrentPage(1);
              }}
              id="course-filter-select"
            >
              <option value="ALL">All Departments</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Age Cohort Selector */}
          <div className="select-container">
            <label htmlFor="age-filter-select" className="filter-label">Age Cohort:</label>
            <select
              className="filter-select-element"
              value={ageFilter}
              onChange={(e) => {
                setAgeFilter(e.target.value);
                setCurrentPage(1);
              }}
              id="age-filter-select"
            >
              <option value="ALL">All Ages</option>
              <option value="UNDER_20">Under 20</option>
              <option value="20_25">20 to 25</option>
              <option value="OVER_25">26 and Above</option>
            </select>
          </div>

          {/* Rows Per Page */}
          <div className="select-container">
            <label htmlFor="page-size-select" className="filter-label">Rows:</label>
            <select
              className="filter-select-element"
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value);
                setCurrentPage(1);
              }}
              id="page-size-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value="ALL">All</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn-text-action"
              title="Reset all filters"
            >
              Reset Filters
            </button>
          )}

          {/* Export to CSV */}
          <button
            onClick={() => handleExportCSV(false)}
            className="btn-table-action"
            title="Export filtered roster to CSV spreadsheet"
            disabled={sortedStudents.length === 0}
            id="export-csv-btn"
          >
            <IconDownload size={14} />
            <span>Export CSV</span>
          </button>

          {/* Print Roster */}
          <button
            onClick={handlePrint}
            className="btn-table-action"
            title="Print printable academic roster"
            disabled={sortedStudents.length === 0}
            id="table-print-btn"
          >
            <IconPrinter size={14} />
            <span>Print</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className={`btn-table-icon ${isLoading ? 'is-loading' : ''}`}
            title="Refresh database records"
            aria-label="Refresh records"
          >
            <IconRefresh size={14} />
          </button>
        </div>
      </div>

      {/* Batch Action Toolbar when rows are selected */}
      {selectedIds.size > 0 && (
        <div className="batch-toolbar no-print">
          <div className="batch-info">
            <span className="batch-count">{selectedIds.size}</span>
            <span>student record(s) selected</span>
          </div>
          <div className="batch-actions">
            <button
              onClick={() => handleExportCSV(true)}
              className="btn-batch-action"
              title="Export only selected students"
            >
              <IconDownload size={13} />
              <span>Export Selected ({selectedIds.size})</span>
            </button>

            {onBatchDelete && (
              <button
                onClick={() => onBatchDelete(Array.from(selectedIds))}
                className="btn-batch-delete"
                title="Permanently remove selected students"
              >
                <IconTrash size={13} />
                <span>Delete Selected ({selectedIds.size})</span>
              </button>
            )}

            <button
              onClick={clearSelection}
              className="btn-batch-cancel"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="table-container">
        <table className="roster-table" id="student-roster-table">
          <thead>
            <tr>
              <th className="th-checkbox no-print">
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all students on current page"
                />
              </th>
              <th onClick={() => handleSort('id')} className="th-sortable">
                <div className="th-flex">
                  <span>Record ID</span>
                  {renderSortIcon('id')}
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="th-sortable">
                <div className="th-flex">
                  <span>Student Name & Email</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('age')} className="th-sortable">
                <div className="th-flex">
                  <span>Age</span>
                  {renderSortIcon('age')}
                </div>
              </th>
              <th onClick={() => handleSort('course')} className="th-sortable">
                <div className="th-flex">
                  <span>Academic Program</span>
                  {renderSortIcon('course')}
                </div>
              </th>
              <th onClick={() => handleSort('createdAt')} className="th-sortable">
                <div className="th-flex">
                  <span>Enrollment Date</span>
                  {renderSortIcon('createdAt')}
                </div>
              </th>
              <th>Status</th>
              <th className="th-actions no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Real Skeleton Loaders (flat neutral loading bars)
              Array.from({ length: pageSize === 'ALL' ? 8 : Math.min(Number(pageSize), 8) }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  <td className="no-print"><div className="skeleton-box skeleton-chk"></div></td>
                  <td><div className="skeleton-box skeleton-w-sm"></div></td>
                  <td>
                    <div className="skeleton-box skeleton-w-lg"></div>
                    <div className="skeleton-box skeleton-w-md skeleton-mt"></div>
                  </td>
                  <td><div className="skeleton-box skeleton-w-xs"></div></td>
                  <td><div className="skeleton-box skeleton-w-md"></div></td>
                  <td><div className="skeleton-box skeleton-w-sm"></div></td>
                  <td><div className="skeleton-box skeleton-w-xs"></div></td>
                  <td className="no-print"><div className="skeleton-box skeleton-w-sm"></div></td>
                </tr>
              ))
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row-cell">
                  <div className="empty-panel">
                    <div className="empty-heading">No Student Records Found</div>
                    <p className="empty-text">
                      {hasActiveFilters
                        ? 'No students matched the active search or filter criteria. Modify or reset filters to display records.'
                        : 'No student records currently exist in the database.'}
                    </p>
                    <div className="empty-actions no-print">
                      {hasActiveFilters ? (
                        <button onClick={resetFilters} className="btn-secondary">
                          Reset Filter Criteria
                        </button>
                      ) : (
                        <button onClick={onOpenCreateModal} className="btn-primary">
                          <IconPlus size={15} />
                          <span>Register First Student</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`student-row ${isSelected ? 'row-selected' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="no-print td-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(student.id)}
                        aria-label={`Select student record #${student.id}`}
                      />
                    </td>

                    {/* ID */}
                    <td className="td-mono">
                      #{student.id}
                    </td>

                    {/* Name & Email */}
                    <td>
                      <div className="student-identity">
                        <span className="student-full-name">{student.name}</span>
                        <span className="student-email-address">{student.email}</span>
                      </div>
                    </td>

                    {/* Age */}
                    <td>
                      <span className="age-text">{student.age}</span>
                    </td>

                    {/* Course */}
                    <td>
                      <span className="program-tag">{student.course}</span>
                    </td>

                    {/* Enrolled Date */}
                    <td>
                      <span className="date-text">{formatDate(student.createdAt)}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>

                    {/* Operations */}
                    <td className="no-print td-actions">
                      <div className="actions-cluster">
                        <button
                          onClick={() => onViewStudent(student)}
                          className="action-link-btn"
                          title="View Student Record"
                          id={`view-btn-${student.id}`}
                        >
                          <IconEye size={14} />
                          <span className="action-text">View</span>
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          className="action-link-btn"
                          title="Edit Student Record"
                          id={`edit-btn-${student.id}`}
                        >
                          <IconEdit size={14} />
                          <span className="action-text">Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="action-link-btn action-link-danger"
                          title="Delete Student Record"
                          id={`delete-btn-${student.id}`}
                        >
                          <IconTrash size={14} />
                          <span className="action-text">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Status Footer */}
      <div className="table-footer-pagination no-print">
        <div className="pagination-count">
          Showing{' '}
          <strong>
            {totalRecords === 0
              ? 0
              : (currentPage - 1) * effectivePageSize + 1}
          </strong>{' '}
          to{' '}
          <strong>
            {Math.min(currentPage * effectivePageSize, totalRecords)}
          </strong>{' '}
          of <strong>{totalRecords}</strong> student records
          {totalRecords !== students.length && (
            <span className="filtered-tally"> (filtered from {students.length} total)</span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-nav">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
              title="Previous Page"
              aria-label="Previous Page"
            >
              <IconChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => {
                // Show first, last, and window around current page
                if (
                  pg === 1 ||
                  pg === totalPages ||
                  (pg >= currentPage - 1 && pg <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`page-num-btn ${currentPage === pg ? 'page-active' : ''}`}
                    >
                      {pg}
                    </button>
                  );
                } else if (
                  pg === currentPage - 2 ||
                  pg === currentPage + 2
                ) {
                  return <span key={pg} className="page-ellipsis">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
              title="Next Page"
              aria-label="Next Page"
            >
              <span>Next</span>
              <IconChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
