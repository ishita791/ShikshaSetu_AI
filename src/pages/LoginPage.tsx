// LearnReach AI - Sign In Page
// Supports email/password credentials and instant demo accounts for testing

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, UserCheck, Shield, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginDemo, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'TEACHER') navigate('/teacher');
      else if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'TEACHER') navigate('/teacher');
      else if (loggedUser.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
    setError(null);
    setSubmitting(true);
    try {
      await loginDemo(role);
      if (role === 'TEACHER') navigate('/teacher');
      else if (role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to log in with demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200/90 shadow-sm">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to LearnReach AI
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your personal tutor, lessons, and practice quizzes
          </p>
        </div>

        {/* Demo Fast-Login Section */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              Quick Demo Accounts
            </span>
            <span className="text-[11px] font-normal text-slate-500">Instant Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('STUDENT')}
              disabled={submitting}
              className="py-2 px-2 text-xs font-medium rounded-lg border border-teal-200 bg-white text-teal-800 hover:bg-teal-50 hover:border-teal-300 transition-colors text-center"
            >
              Student Priya
            </button>
            <button
              type="button"
              onClick={() => handleDemo('TEACHER')}
              disabled={submitting}
              className="py-2 px-2 text-xs font-medium rounded-lg border border-teal-200 bg-white text-teal-800 hover:bg-teal-50 hover:border-teal-300 transition-colors text-center"
            >
              Teacher Anita
            </button>
            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              disabled={submitting}
              className="py-2 px-2 text-xs font-medium rounded-lg border border-teal-200 bg-white text-teal-800 hover:bg-teal-50 hover:border-teal-300 transition-colors text-center"
            >
              Admin Vikram
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@rurallearn.org"
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 shadow-xs"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-stone-100">
          New to LearnReach AI?{' '}
          <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};
