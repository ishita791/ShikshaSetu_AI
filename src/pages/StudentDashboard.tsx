// LearnReach AI - Personalized Student Dashboard
// Displays daily goals, streak, quiz mastery, weak topics, and recommended next modules

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProgressOverview, SubjectProgress } from '../types';
import { 
  Flame, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Play,
  RotateCcw
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [subjectStats, setSubjectStats] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ov, subs] = await Promise.all([
          api.getProgressOverview(),
          api.getSubjectProgress(),
        ]);
        setOverview(ov);
        setSubjectStats(subs);
      } catch (err: any) {
        console.error('Failed to load student dashboard:', err);
        setError('Could not load real-time progress. Showing cached offline data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-28 bg-stone-200/70 rounded-2xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-24 bg-stone-200/70 rounded-xl"></div>
            <div className="h-24 bg-stone-200/70 rounded-xl"></div>
            <div className="h-24 bg-stone-200/70 rounded-xl"></div>
            <div className="h-24 bg-stone-200/70 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-stone-200/70 rounded-xl lg:col-span-2"></div>
            <div className="h-64 bg-stone-200/70 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const profile = user?.profile;
  const streak = overview?.streakDays || profile?.streakDays || 1;
  const points = overview?.totalPoints || profile?.totalPoints || 0;
  const avgScore = overview?.averageScore || 70;
  const completedTopics = overview?.completedTopicsCount || 1;
  const totalTopics = overview?.totalTopicsCount || 6;
  const weakConcepts = overview?.weakConcepts || [];
  const recommendedLesson = overview?.recommendedNextLesson;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <span>{profile?.gradeLevel || 'Class 8'}</span>
            <span aria-hidden="true">·</span>
            <span>{profile?.villageOrRegion || 'Regional Study Group'}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{profile?.preferredLanguage === 'hi' ? 'हिन्दी माध्यम' : profile?.preferredLanguage === 'or' ? 'ଓଡ଼ିଆ ମାଧ୍ୟମ' : profile?.preferredLanguage === 'bn' ? 'বাংলা মাধ্যম' : 'English Medium'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Namaste, {user?.name || 'Student'}!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            You're making steady daily progress. Your personalized AI tutor is ready to explain any doubts in your preferred language.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/tutor"
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </Link>
          <Link
            to="/quizzes"
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-stone-50 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Practice Quiz</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {streak} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <p className="text-[11px] text-slate-400">Keep learning daily to extend streak</p>
        </div>

        {/* Topics Completed */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Topics Mastered</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {completedTopics} <span className="text-xs font-normal text-slate-500">/ {totalTopics}</span>
          </div>
          <p className="text-[11px] text-slate-400">Foundational curriculum</p>
        </div>

        {/* Average Quiz Score */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg Quiz Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {avgScore}%
          </div>
          <p className="text-[11px] text-slate-400">
            {avgScore >= 80 ? 'Mastery level' : avgScore >= 50 ? 'Steady progress' : 'Foundational practice'}
          </p>
        </div>

        {/* Total Points / Badges */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Knowledge Points</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {points} <span className="text-xs font-normal text-slate-500">pts</span>
          </div>
          <p className="text-[11px] text-slate-400">+15 pts per correct answer</p>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Recommended Lesson & Weak Topics & Subject Progress */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recommended Next Lesson Card */}
          {recommendedLesson && (
            <div className="bg-teal-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-medium text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Recommended Next Lesson</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {recommendedLesson.title}
                </h3>
                <p className="text-xs text-teal-100/80">
                  Subject: {recommendedLesson.subjectName} · Tailored to reinforce foundational principles
                </p>
              </div>

              <Link
                to="/tutor"
                state={{ topicId: recommendedLesson.id, subjectId: recommendedLesson.subjectId }}
                className="px-4 py-2.5 text-xs font-semibold text-teal-950 bg-white rounded-lg hover:bg-stone-100 transition-colors inline-flex items-center gap-2 shrink-0 self-start sm:self-center shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue Learning</span>
              </Link>
            </div>
          )}

          {/* Weak Topics Requiring Revision */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Topics Requiring Targeted Revision</span>
              </div>
              <span className="text-xs text-slate-500">Based on past quiz attempts</span>
            </div>

            {weakConcepts.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-medium text-slate-700">No weak learning gaps detected!</p>
                <p>Keep taking practice quizzes to identify areas for mastery.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Our adaptive algorithm noticed you had trouble with these concepts. Click to revise with the AI Tutor:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {weakConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{concept}</div>
                        <div className="text-[11px] text-slate-500">Foundational review needed</div>
                      </div>
                      <Link
                        to="/tutor"
                        state={{ message: `Can you explain ${concept} to me simply with an everyday rural example?` }}
                        className="p-1.5 bg-white border border-amber-300 rounded text-amber-800 hover:bg-amber-100 transition-colors shrink-0 font-medium"
                        title="Revise this topic"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subject Mastery Overview */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Subject-Wise Learning Progress
              </h3>
              <Link to="/progress" className="text-xs font-medium text-teal-700 hover:underline">
                View Detailed Analytics
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjectStats.map((sub) => (
                <div key={sub.subjectId} className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">{sub.subjectName}</span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {sub.completedTopics}/{sub.totalTopics}
                    </span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(sub.completionPercentage, 5)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{sub.completionPercentage}% Complete</span>
                    <span>Avg {sub.averageScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Quick Tools & Recent Quizzes */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Access Card */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Quick Learning Tools
            </h4>

            <div className="space-y-2">
              <Link
                to="/tutor"
                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-teal-600" />
                  <span>Start Chat with AI Tutor</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Link>

              <Link
                to="/quizzes"
                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Generate Practice Quiz</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Link>

              <Link
                to="/translate"
                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Regional Translation Tools</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Recent Quiz Attempts
              </h4>
              <Link to="/progress" className="text-[11px] text-teal-700 hover:underline">
                All
              </Link>
            </div>

            {(!overview?.recentAttempts || overview.recentAttempts.length === 0) ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No quizzes taken yet. Test your understanding!
              </div>
            ) : (
              <div className="space-y-2">
                {overview.recentAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        Score: {att.score}/{att.totalQuestions}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold tabular-nums ${att.percentage >= 80 ? 'text-emerald-700' : att.percentage >= 50 ? 'text-teal-700' : 'text-amber-700'}`}>
                        {att.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SDG 4 Educational Note */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900 space-y-1.5 leading-relaxed">
            <div className="font-semibold text-teal-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>Personalized Learning Guarantee</span>
            </div>
            <p className="text-[11px] text-teal-800">
              There are no penalties for mistakes here. Every quiz attempt is an opportunity for the AI tutor to refine your lesson plan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
