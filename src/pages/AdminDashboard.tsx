// LearnReach AI - System Administrator Dashboard
// Platform usage stats, user role management, and curriculum control

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Target, 
  AlertCircle 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [ov, uList] = await Promise.all([
          api.getAdminOverview(),
          api.getAdminUsers(),
        ]);
        setOverview(ov);
        setUsers(uList);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin controls.');
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>System Administration & Platform Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Oversee platform health, monitor SDG 4 rural education impact metrics, and configure user permissions.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.totalUsers || users.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {overview?.studentCount} Students · {overview?.teacherCount} Teachers
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Curriculum Modules</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.totalTopics || 6}
          </div>
          <div className="text-[11px] text-slate-400">Across {overview?.totalSubjects || 4} subjects</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Quizzes Generated</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.totalQuizzes || 0}
          </div>
          <div className="text-[11px] text-slate-400">Adaptive assessments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Quiz Attempts</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.totalQuizAttempts || 0}
          </div>
          <div className="text-[11px] text-slate-400">Server verified evaluations</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            User Accounts & Role Permissions
          </h2>
          <span className="text-xs text-slate-400">{users.length} accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-slate-500 font-medium">
                <th className="pb-3 pl-2">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Grade / Village</th>
                <th className="pb-3">Language</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/50">
                  <td className="py-3 pl-2 flex items-center gap-2">
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-7 h-7 rounded-full bg-teal-100"
                    />
                    <span className="font-semibold text-slate-900">{u.name}</span>
                  </td>
                  <td className="py-3 text-slate-600">{u.email}</td>
                  <td className="py-3 text-slate-500">
                    {u.profile ? `${u.profile.gradeLevel} · ${u.profile.villageOrRegion || 'Regional'}` : 'Staff'}
                  </td>
                  <td className="py-3 text-slate-500 uppercase">
                    {u.profile?.preferredLanguage || 'EN'}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : u.role === 'TEACHER' ? 'bg-teal-50 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-[11px] py-1 px-2 bg-stone-100 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-600"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
