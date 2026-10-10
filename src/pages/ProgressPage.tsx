// LearnReach AI - Learning Progress & Analytics Dashboard
// Recharts visualizations for quiz history, subject mastery, and weak topics

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProgressOverview, SubjectProgress } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Calendar,
  BookOpen
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [subjectStats, setSubjectStats] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [ov, subs] = await Promise.all([
          api.getProgressOverview(),
          api.getSubjectProgress(),
        ]);
        setOverview(ov);
        setSubjectStats(subs);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  // Format quiz history data for Recharts
  const attemptsChartData = (overview?.recentAttempts || [])
    .slice()
    .reverse()
    .map((att, idx) => ({
      index: `Quiz ${idx + 1}`,
      percentage: att.percentage,
      score: `${att.score}/${att.totalQuestions}`,
      date: new Date(att.completedAt).toLocaleDateString(),
    }));

  const subjectChartData = subjectStats.map(s => ({
    name: s.code,
    fullName: s.subjectName,
    completion: s.completionPercentage,
    avgScore: s.averageScore,
  }));

  const weakList = overview?.weakConcepts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span>Progress & Pedagogical Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Your Learning Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Track subject completion, score improvements, and concepts targeted for revision.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Average Quiz Score</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.averageScore || 0}%
          </div>
          <div className="text-[11px] text-slate-400">Across all attempted modules</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Quizzes Completed</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.totalQuizzesTaken || 0}
          </div>
          <div className="text-[11px] text-slate-400">Server verified assessments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Topics Mastered</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.completedTopicsCount || 0}
          </div>
          <div className="text-[11px] text-slate-400">Out of {overview?.totalTopicsCount || 6} curriculum topics</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Daily Streak</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {overview?.streakDays || 1} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-slate-400">Consistent learning pace</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Score Trend Line Chart */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Quiz Score Trajectory
            </h3>
            <span className="text-xs text-slate-400">Last attempts</span>
          </div>

          {attemptsChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              Take a quiz to see your score trajectory chart.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attemptsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="index" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#0d9488" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#0d9488', r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Subject-Wise Mastery Bar Chart */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Subject Mastery (%)
            </h3>
            <span className="text-xs text-slate-400">Foundational subjects</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Mastery']}
                />
                <Bar dataKey="avgScore" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Weak & Strong Topics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Identified Weak Topics */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-stone-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Target Concepts for Revision</span>
          </div>

          {weakList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">No weak topics recorded</p>
              <p>Keep answering quizzes to detect areas for refinement.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {weakList.map((concept, idx) => (
                <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{concept}</div>
                    <div className="text-[11px] text-slate-500">Missed in recent evaluation</div>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                    Needs Practice
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mastered Subjects & Achievements */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-stone-100 pb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Mastery Milestones</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900">Photosynthesis Foundations</div>
                <div className="text-[11px] text-slate-500">General Science · Mastered</div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                85%+ Score
              </span>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200/70 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900">Solar Energy Circuits</div>
                <div className="text-[11px] text-slate-500">General Science · In Progress</div>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded">
                Active Module
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
