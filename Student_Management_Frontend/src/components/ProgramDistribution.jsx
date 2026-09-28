import React from 'react';

// Restrained, institutional palette (deep blues, slates, steel, teal - no neon or rainbow colors)
const DEPARTMENT_COLORS = [
  '#1e40af',
  '#0f766e',
  '#334155',
  '#0284c7',
  '#4338ca',
  '#475569',
  '#155e75',
  '#1e293b',
];

export default function ProgramDistribution({
  courseDistribution = {},
  totalStudents = 0,
  selectedCourse = '',
  onSelectCourse,
}) {
  const entries = Object.entries(courseDistribution);
  if (entries.length === 0) return null;

  return (
    <div className="distribution-panel">
      <div className="distribution-header">
        <span className="distribution-title">Academic Program Enrollment Distribution</span>
        <span className="distribution-note">Select department filter</span>
      </div>

      {/* Segmented bar */}
      <div className="distribution-bar">
        {entries.map(([courseName, count], idx) => {
          const percent = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
          const color = DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length];
          return (
            <div
              key={courseName}
              className="distribution-segment"
              style={{
                width: `${Math.max(percent, 3)}%`,
                backgroundColor: color,
              }}
              title={`${courseName}: ${count} student(s) (${percent.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Filter Chips */}
      <div className="distribution-chips">
        <button
          className={`program-chip ${!selectedCourse || selectedCourse === 'ALL' ? 'chip-active' : ''}`}
          onClick={() => onSelectCourse('ALL')}
        >
          <span className="chip-name">All Programs</span>
          <span className="chip-badge">{totalStudents}</span>
        </button>

        {entries.map(([courseName, count], idx) => {
          const color = DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length];
          const isSelected = selectedCourse === courseName;
          const percent = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(0) : 0;

          return (
            <button
              key={courseName}
              className={`program-chip ${isSelected ? 'chip-active' : ''}`}
              onClick={() => onSelectCourse(courseName)}
            >
              <span
                className="chip-indicator"
                style={{ backgroundColor: color }}
              />
              <span className="chip-name">{courseName}</span>
              <span className="chip-badge">{count}</span>
              <span className="chip-percent">{percent}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
