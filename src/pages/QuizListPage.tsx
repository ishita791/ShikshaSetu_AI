// LearnReach AI - Smart AI Quiz Generator & Quiz Catalog
// Configures adaptive parameters and generates targeted assessments

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Subject, Topic, Quiz, QuizAttempt } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Award, 
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const QuizListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [myAttempts, setMyAttempts] = useState<QuizAttempt[]>([]);

  // Generator form
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj_science');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('top_photosynthesis');
  const [difficulty, setDifficulty] = useState<string>('BEGINNER');
  const [language, setLanguage] = useState<string>(user?.profile?.preferredLanguage || 'en');
  const [questionCount, setQuestionCount] = useState<number>(4);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [subs, qList, atts] = await Promise.all([
          api.getSubjects(),
          api.getQuizzes(),
          api.getMyAttempts(),
        ]);
        setSubjects(subs);
        setQuizzes(qList);
        setMyAttempts(atts);

        if (subs.length > 0) {
          setSelectedSubjectId(subs[0].id);
          const topList = await api.getTopics(subs[0].id);
          setTopics(topList);
          if (topList.length > 0) setSelectedTopicId(topList[0].id);
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      }
    }
    loadData();
  }, []);

  const handleSubjectChange = async (subjId: string) => {
    setSelectedSubjectId(subjId);
    try {
      const topList = await api.getTopics(subjId);
      setTopics(topList);
      if (topList.length > 0) setSelectedTopicId(topList[0].id);
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGenerating(true);

    try {
      const res = await api.generateQuiz({
        subjectId: selectedSubjectId,
        topicId: selectedTopicId,
        difficulty,
        language,
        questionCount,
      });

      // Navigate straight to quiz player with newly generated quiz
      navigate(`/quizzes/${res.quiz.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate smart quiz. Please retry.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Adaptive Performance-Based Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Smart AI Practice Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Questions calibrated to target your specific learning gaps. Scores are calculated safely on our server, providing actionable revision guidance based on your results.
        </p>
      </div>

      {/* Generator Card & Catalog Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: AI Quiz Generator Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Generate Targeted Quiz</span>
            </h2>
            <p className="text-xs text-slate-500">
              Customize subject, difficulty, and language
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            
            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Curriculum Topic
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            {/* Language & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-teal-900"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="or">Odia (ଓଡ଼ିଆ)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Number of Questions</span>
                <span className="tabular-nums font-semibold text-teal-800">{questionCount} questions</span>
              </div>
              <input
                type="range"
                min={3}
                max={6}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? 'Generating Questions with AI...' : 'Generate and Start Quiz'}</span>
            </button>
          </form>

          {/* Adaptive Note */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Adaptive Algorithm:</span> Missed concepts from previous quizzes will be automatically targeted in the new question batch.
          </div>
        </div>

        {/* Right: Curated Available Quizzes & Past Attempts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Available Quizzes */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Curriculum Quiz Catalog
              </h2>
              <span className="text-xs text-slate-400">{quizzes.length} available</span>
            </div>

            <div className="space-y-3">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-xl flex items-center justify-between gap-4 hover:border-teal-200 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-slate-900">
                      {q.title}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="capitalize">{q.difficulty.toLowerCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.questionCount} Questions</span>
                      <span aria-hidden="true">·</span>
                      <span className="uppercase">{q.language}</span>
                    </div>
                  </div>

                  <Link
                    to={`/quizzes/${q.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Past Attempts */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Your Past Quiz Attempts
              </h2>
              <span className="text-xs text-slate-400">{myAttempts.length} total attempts</span>
            </div>

            {myAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                You haven't attempted any quizzes yet. Generate a quiz above to begin!
              </p>
            ) : (
              <div className="space-y-2.5">
                {myAttempts.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">
                        Score: {att.score}/{att.totalQuestions} ({att.percentage}%)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Completed on {new Date(att.completedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${att.percentage >= 80 ? 'bg-emerald-50 text-emerald-700' : att.percentage >= 50 ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                        {att.percentage >= 80 ? 'Mastery' : att.percentage >= 50 ? 'Review' : 'Foundational'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
