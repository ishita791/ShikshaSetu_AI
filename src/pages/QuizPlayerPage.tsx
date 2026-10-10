// LearnReach AI - Interactive Quiz Assessment Player
// Enforces server-side scoring, shows one question at a time, and provides detailed pedagogical review

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Quiz, Question, QuizAttempt, EvaluatedAnswer } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  AlertTriangle, 
  Sparkles, 
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const QuizPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Student selected answers map: { [questionId]: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Results state once evaluated by backend
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  const [detailedReview, setDetailedReview] = useState<EvaluatedAnswer[]>([]);

  useEffect(() => {
    async function loadQuiz() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getQuiz(id);
        setQuiz(data.quiz);
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (attemptResult) return; // Prevent changing after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!id || questions.length === 0) return;
    setError(null);
    setSubmitting(true);

    try {
      const answersPayload = questions.map(q => ({
        questionId: q.id,
        selectedOptionIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      }));

      // Server calculates the score and checks correct answers!
      const res = await api.submitQuiz(id, answersPayload);
      setAttemptResult(res.attempt);
      setDetailedReview(res.detailedReview);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500">Loading quiz questions...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
          {error}
        </div>
        <Link to="/quizzes" className="text-xs font-semibold text-teal-700 hover:underline">
          Return to Quizzes Catalog
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQ > 0 ? Math.round(((currentIdx + 1) / totalQ) * 100) : 0;

  // --- RESULTS VIEW (Once submitted and calculated by server) ---
  if (attemptResult) {
    const isMastery = attemptResult.percentage >= 80;
    const isMedium = attemptResult.percentage >= 50 && attemptResult.percentage < 80;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Results Banner */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-50 border border-stone-200 shadow-xs mx-auto">
            {isMastery ? (
              <Award className="w-8 h-8 text-emerald-600" />
            ) : isMedium ? (
              <Sparkles className="w-8 h-8 text-teal-600" />
            ) : (
              <RotateCcw className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Quiz Completed!
            </h1>
            <p className="text-xs text-slate-500">
              {quiz?.title}
            </p>
          </div>

          {/* Score Display */}
          <div className="py-2">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tabular-nums">
              {attemptResult.percentage}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              You scored <span className="font-semibold text-slate-800">{attemptResult.score}</span> out of <span className="font-semibold text-slate-800">{attemptResult.totalQuestions}</span> questions correctly
            </div>
          </div>

          {/* Adaptive Recommendation Card */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-left space-y-2 text-xs">
            <div className="font-semibold text-teal-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Adaptive Learning Guidance</span>
            </div>
            <ul className="space-y-1 text-teal-900 leading-relaxed list-disc list-inside">
              {attemptResult.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/tutor"
              state={{ message: `I just took a quiz on ${quiz?.title} and scored ${attemptResult.percentage}%. Can you help me review the concepts I missed?` }}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
            >
              Review Doubts with AI Tutor
            </Link>
            <Link
              to="/quizzes"
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-stone-50 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>

        {/* Detailed Question-by-Question Review */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Pedagogical Question Review
          </h2>

          <div className="space-y-4">
            {detailedReview.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-5 rounded-2xl border bg-white space-y-3 ${item.isCorrect ? 'border-emerald-200/80' : 'border-rose-200/80'}`}
              >
                <div className="flex items-start justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-500">Question {idx + 1}</span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-xs ${item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct (+15 pts)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-900 leading-snug">
                  {item.prompt}
                </div>

                {/* Explanation */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Explanation & Core Concept</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // --- QUESTION BY QUESTION PLAYER VIEW ---
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Top Header & Progress */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-teal-800">{quiz?.title}</span>
          <span className="tabular-nums">
            Question {currentIdx + 1} of {totalQ}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Current Question Card */}
      {currentQ && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="space-y-1">
            <div className="text-xs text-teal-700 font-semibold">
              {currentQ.topicConcept || 'Core Concept'}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.prompt}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-colors flex items-center gap-3.5 ${isSelected ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs' : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100/60 text-slate-800'}`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-teal-600 text-white' : 'bg-stone-200 text-slate-600'}`}>
                    {optionLetters[optIdx]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(prev - 1, 0))}
              disabled={currentIdx === 0}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIdx < totalQ - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(prev + 1, totalQ - 1))}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Validating Score...' : 'Submit Answers'}</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Answered Counter Footer */}
      <div className="text-center text-xs text-slate-400">
        Answered {answeredCount} of {totalQ} questions · Score will be calculated securely on server
      </div>

    </div>
  );
};
