// LearnReach AI - Teacher & Educator Dashboard
// Monitor student rosters, diagnose classroom weak spots, and recommend targeted revision

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeacherStudentItem } from '../types';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  TrendingUp, 
  Sparkles, 
  Search, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<TeacherStudentItem[]>([]);
  const [classSummary, setClassSummary] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudentItem | null>(null);
  
  // Recommend modal state
  const [recommendNote, setRecommendNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [stList, summary] = await Promise.all([
          api.getTeacherStudents(),
          api.getClassSummary(),
        ]);
        setStudents(stList);
        setClassSummary(summary);
        if (stList.length > 0) setSelectedStudent(stList[0]);
      } catch (err) {
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !recommendNote.trim()) return;

    setSubmittingNote(true);
    try {
      await api.recommendTopic(selectedStudent.id, recommendNote);
      setRecommendSuccess(true);
      setRecommendNote('');
      setTimeout(() => setRecommendSuccess(false), 3000);
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.villageOrRegion.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
          <Users className="w-4 h-4 text-teal-600" />
          <span>Educator & Community Learning Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Teacher Classroom Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Monitor your assigned rural students, track average quiz performance, identify recurring conceptual bottlenecks, and send targeted revision guidance.
        </p>
      </div>

      {/* Class Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Assigned Students</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {classSummary?.totalStudents || students.length}
          </div>
          <div className="text-[11px] text-slate-400">Rural learning cluster</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Quizzes Evaluated</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {classSummary?.totalQuizzesCompleted || 0}
          </div>
          <div className="text-[11px] text-slate-400">Server verified assessments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Classroom Average Score</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {classSummary?.classAverageScore || 0}%
          </div>
          <div className="text-[11px] text-slate-400">Comprehensive average</div>
        </div>
      </div>

      {/* Common Class Learning Gaps */}
      {classSummary?.commonWeakConcepts && classSummary.commonWeakConcepts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Top Identified Class Weak Concepts</span>
          </div>
          <p className="text-xs text-amber-800">
            Multiple students are currently experiencing learning gaps with these topics:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {classSummary.commonWeakConcepts.map((item: any, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 flex items-center gap-1.5 shadow-xs"
              >
                <span>{item.concept}</span>
                <span className="text-[11px] text-amber-600 font-normal">({item.count} students)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Roster & Inspection Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Student Roster Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Student Roster
            </h2>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, grade, or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 w-full sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-2">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-center justify-between gap-4 ${selectedStudent?.id === st.id ? 'bg-teal-50/70 border-teal-300 shadow-xs' : 'bg-stone-50/40 border-stone-200 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(st.name)}`}
                    alt={st.name}
                    className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200"
                  />
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {st.gradeLevel} · {st.villageOrRegion}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold text-xs sm:text-sm tabular-nums ${st.averageScore >= 80 ? 'text-emerald-700' : st.averageScore >= 50 ? 'text-teal-700' : 'text-amber-700'}`}>
                    {st.averageScore}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {st.quizzesTaken} quizzes · {st.streakDays}d streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Student Inspector & Recommendation Tool (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedStudent ? (
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <img
                  src={selectedStudent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedStudent.name)}`}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-full bg-teal-100"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-slate-500">Current Grade</div>
                  <div className="font-semibold text-slate-800">{selectedStudent.gradeLevel}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-slate-500">Preferred Medium</div>
                  <div className="font-semibold text-slate-800 uppercase">{selectedStudent.preferredLanguage}</div>
                </div>
              </div>

              {/* Weak Concepts */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Student Learning Gaps</span>
                </div>
                {selectedStudent.weakConcepts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No recurring weak concepts recorded.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.weakConcepts.map((c, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-[11px] font-medium text-amber-900">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Teacher Recommendation Box */}
              <form onSubmit={handleRecommendSubmit} className="space-y-3 pt-3 border-t border-stone-100">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Send Pedagogical Study Note</span>
                </div>

                <textarea
                  rows={3}
                  value={recommendNote}
                  onChange={(e) => setRecommendNote(e.target.value)}
                  placeholder={`Recommend specific topics or revision steps for ${selectedStudent.name.split(' ')[0]}...`}
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-600 resize-none"
                />

                {recommendSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guidance note successfully assigned to student!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingNote || !recommendNote.trim()}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingNote ? 'Saving...' : 'Send Recommendation'}</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white border border-stone-200 rounded-2xl">
              Select a student from the roster to inspect progress.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
