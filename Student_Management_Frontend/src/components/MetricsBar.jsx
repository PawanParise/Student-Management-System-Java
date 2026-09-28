import React from 'react';

export default function MetricsBar({ stats, totalFiltered, totalCourses }) {
  const total = stats?.totalStudents ?? 0;
  const avgAge = stats?.averageAge ?? 0;
  const coursesCount = totalCourses || Object.keys(stats?.courseDistribution || {}).length;

  return (
    <div className="metrics-strip">
      <div className="metric-cell">
        <div className="metric-label">TOTAL ENROLLED</div>
        <div className="metric-number">{total}</div>
        <div className="metric-context">Registered academic records</div>
      </div>

      <div className="metric-cell">
        <div className="metric-label">ACADEMIC PROGRAMS</div>
        <div className="metric-number">{coursesCount}</div>
        <div className="metric-context">Degree & major streams</div>
      </div>

      <div className="metric-cell">
        <div className="metric-label">AVERAGE COHORT AGE</div>
        <div className="metric-number">{avgAge > 0 ? `${avgAge}` : 'N/A'}</div>
        <div className="metric-context">Years (enrolled baseline)</div>
      </div>

      <div className="metric-cell">
        <div className="metric-label">STORAGE ENGINE</div>
        <div className="metric-number metric-mono">PostgreSQL</div>
        <div className="metric-context">Database: student_db (5432)</div>
      </div>
    </div>
  );
}
