import React, { useState, useEffect, useCallback } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths,
} from 'date-fns';
import api from '../utils/api';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AttendanceCalendar({ refresh }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState([]);

  const fetchRecords = useCallback(async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const { data } = await api.get(`/attendance/month?year=${year}&month=${month}`);
      setRecords(data.records);
    } catch (e) { console.error(e); }
  }, [currentMonth]);

  useEffect(() => { fetchRecords(); }, [fetchRecords, refresh]);

  const getRecordForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return records.find(r => r.date === dateStr);
  };

  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="calendar-card">
      <div className="calendar-nav">
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="calendar-nav-btns">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>‹</button>
          <button onClick={() => setCurrentMonth(new Date())}>●</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>›</button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map(day => {
          const rec = getRecordForDay(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const inCurMonth = isSameMonth(day, currentMonth);

          let cls = 'calendar-day';
          if (!inCurMonth) cls += ' other-month';
          else if (isWeekend) cls += ' weekend';
          if (isToday(day)) cls += ' today';
          else if (rec?.status === 'present') cls += ' present';
          else if (rec?.status === 'absent') cls += ' absent';

          let dotColor = null;
          if (rec?.inTime && rec?.outTime) dotColor = 'teal';
          else if (rec?.inTime && !rec?.outTime) dotColor = 'orange';
          else if (rec?.status === 'absent') dotColor = 'red';

          return (
            <div key={day.toISOString()} className={cls} title={rec ? `${rec.locationType || ''} — ${rec.totalHours ? rec.totalHours + 'h' : 'active'}` : ''}>
              {format(day, 'd')}
              {dotColor && <div className={`cal-dot ${dotColor}`} />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--accent-teal)', label: 'Present (full)' },
          { color: 'var(--accent-orange)', label: 'Clocked in (active)' },
          { color: 'var(--error)', label: 'Absent' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
