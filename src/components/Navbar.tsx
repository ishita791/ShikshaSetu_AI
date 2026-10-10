// LearnReach AI - Top Navigation Bar
// Follows strict 3-zone Top Bar Contract and Zero-Pill discipline

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  Languages, 
  CheckCircle2, 
  BarChart3,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <Link 
            to={user ? (user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/'} 
            className="flex items-center gap-2.5 text-slate-900 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">
              LearnReach <span className="text-teal-700">AI</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {!user ? (
              <>
                <Link 
                  to="/" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Home
                </Link>
                <a 
                  href="#features" 
                  className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                >
                  How It Works
                </a>
                <a 
                  href="#sdg-impact" 
                  className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                >
                  SDG 4 Impact
                </a>
                <Link 
                  to="/login" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/login') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Sign In
                </Link>
              </>
            ) : user.role === 'STUDENT' ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/dashboard') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tutor" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/tutor') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  AI Tutor
                </Link>
                <Link 
                  to="/quizzes" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/quizzes') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Smart Quizzes
                </Link>
                <Link 
                  to="/translate" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/translate') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Regional Tools
                </Link>
                <Link 
                  to="/progress" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/progress') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Analytics
                </Link>
              </>
            ) : user.role === 'TEACHER' ? (
              <>
                <Link 
                  to="/teacher" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/teacher') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Teacher Roster
                </Link>
                <Link 
                  to="/quizzes" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/quizzes') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Curriculum Quizzes
                </Link>
                <Link 
                  to="/tutor" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/tutor') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Tutor Sandbox
                </Link>
                <Link 
                  to="/translate" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/translate') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Translation Tools
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/admin') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Admin Overview
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/dashboard') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Student Preview
                </Link>
                <Link 
                  to="/teacher" 
                  className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/teacher') ? 'text-teal-700 font-semibold' : 'hover:text-slate-900'}`}
                >
                  Teacher View
                </Link>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {!user ? (
              <Link 
                to="/register" 
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shadow-xs"
              >
                Start Learning
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-xs text-slate-700"
                >
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`} 
                    alt={user.name} 
                    className="w-5 h-5 rounded-full bg-teal-100"
                  />
                  <span className="font-medium max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                How It Works
              </a>
              <a
                href="#sdg-impact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                SDG 4 Impact
              </a>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-stone-300 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-teal-600 text-white rounded-lg"
                >
                  Start Learning
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Dashboard
              </Link>
              <Link
                to="/tutor"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                AI Personal Tutor
              </Link>
              <Link
                to="/quizzes"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Smart Quizzes
              </Link>
              <Link
                to="/translate"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Regional Translation
              </Link>
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Progress Analytics
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Sign Out ({user.name})
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
