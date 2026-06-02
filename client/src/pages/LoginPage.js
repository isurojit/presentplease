import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import toast from 'react-hot-toast';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      toast.success(isSignup ? 'Account created!' : 'Welcome back!');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Welcome!');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="login-page">
      {/* Left art panel */}
      <div className="login-art">
        <div className="art-grid" />
        <div className="floating-card" style={{ top: '18%', right: '8%' }}>
          <div className="fc-dot teal" />
          <span>Clocked In • 09:02 AM</span>
        </div>
        <div className="floating-card" style={{ bottom: '22%', left: '5%' }}>
          <div className="fc-dot orange" />
          <span>Working from home</span>
        </div>
        <div className="art-content">
          <div className="art-logo">
            <span>Present</span><span>Please</span>
          </div>
          <p className="art-tagline">
            Modern attendance tracking for teams that move fast.<br />
            Clock in, track hours, stay present.
          </p>
          <div className="art-stats">
            <div className="art-stat">
              <div className="art-stat-num">98%</div>
              <div className="art-stat-label">Accuracy</div>
            </div>
            <div className="art-stat">
              <div className="art-stat-num">2s</div>
              <div className="art-stat-label">Clock In</div>
            </div>
            <div className="art-stat">
              <div className="art-stat-num">24/7</div>
              <div className="art-stat-label">Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-section">
        <div className="login-form-box">
          <h1>{isSignup ? 'Create account' : 'Welcome back'}</h1>
          <p>{isSignup ? 'Start tracking your attendance today.' : 'Sign in to your PresentPlease account.'}</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleEmailAuth}>
            {isSignup && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Please wait…' : isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="divider">or</div>

          <button className="btn-google" onClick={handleGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="login-toggle">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignup(!isSignup); setError(''); }}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
