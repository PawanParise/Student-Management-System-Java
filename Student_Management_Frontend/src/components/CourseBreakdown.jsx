import React from 'react';
import { Layers } from 'lucide-react';

export default function CourseBreakdown({
  courseDistribution = {},
  totalStudents = 0,
  selectedCourse = '',
  onSelectCourse,
}) {
  const entries = Object.entries(courseDistribution);
  if (entries.length === 0) return null;

  const colorPalette = [
    { bar: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
    { bar: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
    { bar: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
    { bar: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    { bar: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { bar: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  ];

  return (
    <div className="course-breakdown-card">
      <div className="course-breakdown-header">
        <div className="course-breakdown-title">
          <Layers size={18} className="text-accent" />
          <span>Course Distribution Breakdown</span>
        </div>
        <span className="course-breakdown-hint">Click a stream to filter</span>
      </div>

      <div className="course-progress-multi">
        {entries.map(([courseName, count], idx) => {
          const percent = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
          const color = colorPalette[idx % colorPalette.length];
          return (
            <div
              key={courseName}
              className="course-progress-segment"
              style={{
                width: `${Math.max(percent, 4)}%`,
                backgroundColor: color.bar,
                boxShadow: `0 0 10px ${color.glow}`,
              }}
              title={`${courseName}: ${count} student(s) (${percent.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      <div className="course-chips-list">
        <button
          className={`course-chip ${!selectedCourse || selectedCourse === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectCourse('ALL')}
        >
          <span>All Streams</span>
          <span className="chip-count">{totalStudents}</span>
        </button>

        {entries.map(([courseName, count], idx) => {
          const color = colorPalette[idx % colorPalette.length];
          const isSelected = selectedCourse === courseName;
          const percent = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(0) : 0;

          return (
            <button
              key={courseName}
              className={`course-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCourse(courseName)}
            >
              <span
                className="chip-dot"
                style={{ backgroundColor: color.bar }}
              />
              <span className="chip-label">{courseName}</span>
              <span className="chip-count">{count}</span>
              <span className="chip-percent">({percent}%)</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
