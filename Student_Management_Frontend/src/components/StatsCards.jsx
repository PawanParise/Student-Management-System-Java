import React from 'react';
import { Users, BookOpen, Clock, Database, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats, totalFiltered, totalCourses }) {
  const total = stats?.totalStudents ?? 0;
  const avgAge = stats?.averageAge ?? 0;
  const coursesCount = totalCourses || Object.keys(stats?.courseDistribution || {}).length;

  return (
    <div className="stats-grid">
      {/* Card 1: Total Students */}
      <div className="stat-card stat-card-indigo">
        <div className="stat-header">
          <span className="stat-title">Total Students</span>
          <div className="stat-icon-wrapper icon-indigo">
            <Users size={20} />
          </div>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-footer">
          <span className="stat-badge positive">
            <TrendingUp size={12} style={{ marginRight: '3px' }} /> Active
          </span>
          <span className="stat-subtext">Verified in PostgreSQL</span>
        </div>
      </div>

      {/* Card 2: Average Age */}
      <div className="stat-card stat-card-purple">
        <div className="stat-header">
          <span className="stat-title">Average Age</span>
          <div className="stat-icon-wrapper icon-purple">
            <Clock size={20} />
          </div>
        </div>
        <div className="stat-value">
          {avgAge > 0 ? `${avgAge} yrs` : '—'}
        </div>
        <div className="stat-footer">
          <span className="stat-subtext">Demographic cohort average</span>
        </div>
      </div>

      {/* Card 3: Active Courses */}
      <div className="stat-card stat-card-cyan">
        <div className="stat-header">
          <span className="stat-title">Course Streams</span>
          <div className="stat-icon-wrapper icon-cyan">
            <BookOpen size={20} />
          </div>
        </div>
        <div className="stat-value">{coursesCount}</div>
        <div className="stat-footer">
          <span className="stat-subtext">Specialized departments</span>
        </div>
      </div>

      {/* Card 4: Database & Engine */}
      <div className="stat-card stat-card-emerald">
        <div className="stat-header">
          <span className="stat-title">Database Storage</span>
          <div className="stat-icon-wrapper icon-emerald">
            <Database size={20} />
          </div>
        </div>
        <div className="stat-value stat-value-sm">student_db</div>
        <div className="stat-footer">
          <span className="stat-badge emerald-badge">PostgreSQL 18</span>
          <span className="stat-subtext">Port 5432</span>
        </div>
      </div>
    </div>
  );
}
