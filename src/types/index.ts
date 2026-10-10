// LearnReach AI - Frontend TypeScript Definitions

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LanguageCode = 'en' | 'hi' | 'or' | 'bn';

export interface UserProfile {
  id: string;
  userId: string;
  preferredLanguage: LanguageCode;
  learningLevel: Difficulty;
  gradeLevel: string;
  villageOrRegion?: string;
  schoolName?: string;
  dailyGoalMinutes: number;
  streakDays: number;
  totalPoints: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  grade: string;
  order: number;
  topicCount?: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  content: string;
  keyPoints: string[];
  practicalExample: string;
  ruralContextNote: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  language: string;
  difficulty: Difficulty;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  stepByStepExplanation?: string;
  practicalExample?: string;
  suggestedQuestions?: string[];
  createdAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  prompt: string;
  options: string[];
  topicConcept?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  topicId?: string;
  difficulty: Difficulty;
  language: string;
  questionCount: number;
  isAiGenerated: boolean;
  createdAt: string;
}

export interface EvaluatedAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  correctOptionIndex: number;
  explanation: string;
  prompt: string;
  topicConcept: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakConcepts: string[];
  recommendations: string[];
  completedAt: string;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
}

export interface ProgressOverview {
  studentName?: string;
  streakDays: number;
  totalPoints: number;
  dailyGoalMinutes: number;
  completedTopicsCount: number;
  inProgressTopicsCount: number;
  totalTopicsCount: number;
  totalQuizzesTaken: number;
  averageScore: number;
  weakConcepts: string[];
  recommendedNextLesson?: {
    id: string;
    title: string;
    subjectId: string;
    subjectName: string;
  } | null;
  recentAttempts: QuizAttempt[];
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  code: string;
  icon: string;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  averageScore: number;
}

export interface TeacherStudentItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gradeLevel: string;
  preferredLanguage: string;
  villageOrRegion: string;
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  weakConcepts: string[];
}

export interface TranslationRecord {
  id: string;
  userId: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  simplifiedText?: string;
  createdAt: string;
}
