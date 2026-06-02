import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ClockWidget from '../components/ClockWidget';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCalendar from '../components/AttendanceCalendar';
import StatsGrid from '../components/StatsGrid';
import toast from 'react-hot-toast';

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
  </svg>
);
const CalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const NAV = [
  { id: 'home',     label: 'Dashboard',  Icon: HomeIcon  },
  { id: 'table',    label: 'Attendance', Icon: TableIcon },
  { id: 'calendar', label: 'Calendar',   Icon: CalIcon   },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('home');
  const [refresh, setRefresh] = useState(0);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
  };

  const handleAttendanceChange = () => setRefresh(r => r + 1);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">
            <span>Present</span><span>Please</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              <span className="nav-icon"><Icon /></span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : initials
            }
          </div>
          <div className="user-info">
            <div className="user-name">{user?.displayName || 'User'}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Sign out">
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {tab === 'home' && (
          <>
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Track your attendance in real time</p>
            </div>
            <ClockWidget onAttendanceChange={handleAttendanceChange} />
            <StatsGrid refresh={refresh} />
            <AttendanceCalendar refresh={refresh} />
          </>
        )}

        {tab === 'table' && (
          <>
            <div className="page-header">
              <h1>Attendance Log</h1>
              <p>Your complete attendance history</p>
            </div>
            <AttendanceTable refresh={refresh} />
          </>
        )}

        {tab === 'calendar' && (
          <>
            <div className="page-header">
              <h1>Calendar</h1>
              <p>Monthly attendance overview</p>
            </div>
            <AttendanceCalendar refresh={refresh} />
            <AttendanceTable refresh={refresh} />
          </>
        )}
      </main>
    </div>
  );
}
