import React, { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import api from '../utils/api';

const fmt = (d) => d ? format(new Date(d), 'hh:mm a') : '—';
const fmtDate = (d) => format(new Date(d), 'EEE, MMM d');
const fmtHours = (h) => h ? `${h}h` : '—';

const LocationBadge = ({ type }) => {
  const map = {
    'in-office': { label: '🏢 In Office', cls: 'in-office' },
    'outside-office': { label: '🌍 Outside', cls: 'outside' },
    'remote': { label: '🏠 Remote', cls: 'remote' },
  };
  const t = map[type] || map['in-office'];
  return <span className={`badge ${t.cls}`}>{t.label}</span>;
};

const StatusBadge = ({ status }) => {
  const map = {
    present: { label: '✓ Present', cls: 'present' },
    absent: { label: '✗ Absent', cls: 'absent' },
    'half-day': { label: '½ Half Day', cls: 'half-day' },
  };
  const t = map[status] || map['present'];
  return <span className={`badge ${t.cls}`}>{t.label}</span>;
};

export default function AttendanceTable({ refresh }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const { data } = await api.get(`/attendance/month?year=${year}&month=${month}`);
      setRecords(data.records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => { fetchRecords(); }, [fetchRecords, refresh]);

  const totalPresent = records.filter(r => r.status === 'present').length;
  const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2>Attendance Log</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {totalPresent} days present · {totalHours.toFixed(1)}h total
          </p>
        </div>
        <div className="month-nav">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>‹</button>
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>›</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <p>No attendance records for this month.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Hours</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(rec => (
                <tr key={rec._id}>
                  <td style={{ fontWeight: 500 }}>{fmtDate(rec.date + 'T12:00:00')}</td>
                  <td style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{fmt(rec.inTime)}</td>
                  <td style={{ color: 'var(--accent-orange)', fontWeight: 500 }}>{fmt(rec.outTime)}</td>
                  <td>{fmtHours(rec.totalHours)}</td>
                  <td><LocationBadge type={rec.locationType} /></td>
                  <td><StatusBadge status={rec.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
