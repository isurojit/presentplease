import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">
          <span className="splash-present">Present</span>
          <span className="splash-please">Please</span>
        </div>
        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#e8e8f0',
          border: '1px solid #2d2d4e',
          borderRadius: '12px',
          fontFamily: '"DM Sans", sans-serif',
        },
        success: { iconTheme: { primary: '#00d4aa', secondary: '#1a1a2e' } },
        error: { iconTheme: { primary: '#ff6b6b', secondary: '#1a1a2e' } },
      }} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
