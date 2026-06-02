import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import api from '../utils/api';

export default function StatsGrid({ refresh }) {
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const now = new Date();
      const { data } = await api.get(
        `/attendance/month?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
      );
      const records = data.records;
      const present = records.filter(r => r.status === 'present').length;
      const totalHours = records.reduce((s, r) => s + (r.totalHours || 0), 0);
      const inOffice = records.filter(r => r.locationType === 'in-office').length;
      const remote = records.filter(r => r.locationType === 'remote' || r.locationType === 'outside-office').length;
      setStats({ present, totalHours: totalHours.toFixed(1), inOffice, remote });
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats, refresh]);

  const month = format(new Date(), 'MMM');

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-label">Days Present ({month})</div>
        <div className="stat-card-value teal">{stats?.present ?? '—'}</div>
        <div className="stat-card-sub">This month</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Total Hours ({month})</div>
        <div className="stat-card-value orange">{stats?.totalHours ?? '—'}</div>
        <div className="stat-card-sub">Hours worked</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">In Office ({month})</div>
        <div className="stat-card-value purple">{stats?.inOffice ?? '—'}</div>
        <div className="stat-card-sub">Office days</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Remote / Outside</div>
        <div className="stat-card-value white">{stats?.remote ?? '—'}</div>
        <div className="stat-card-sub">This month</div>
      </div>
    </div>
  );
}
