// LearnReach AI - Client API Service
// Communicates with Express REST backend with JWT authorization headers

import {
  User,
  Subject,
  Topic,
  Lesson,
  Quiz,
  Question,
  QuizAttempt,
  EvaluatedAnswer,
  ProgressOverview,
  SubjectProgress,
  TeacherStudentItem,
  ChatMessage,
  ChatSession,
  TranslationRecord
} from '../types';

const TOKEN_KEY = 'learnreach_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(body: any): Promise<{ token: string; user: User }> {
    const res = await fetchApi<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(res.token);
    return res;
  },

  async login(body: any): Promise<{ token: string; user: User }> {
    const res = await fetchApi<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(res.token);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  async getMe(): Promise<User> {
    return fetchApi<User>('/auth/me');
  },

  async updateProfile(updates: any): Promise<User> {
    return fetchApi<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Subjects & Lessons
  async getSubjects(): Promise<Subject[]> {
    return fetchApi<Subject[]>('/subjects');
  },

  async getTopics(subjectId: string): Promise<Topic[]> {
    return fetchApi<Topic[]>(`/subjects/${subjectId}/topics`);
  },

  async getLesson(topicId: string): Promise<Lesson> {
    return fetchApi<Lesson>(`/topics/${topicId}/lesson`);
  },

  // AI Tutor
  async sendChatMessage(params: {
    sessionId?: string;
    message: string;
    subjectId?: string;
    topicId?: string;
    language?: string;
    difficulty?: string;
  }): Promise<{ sessionId: string; message: ChatMessage }> {
    return fetchApi('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getChatHistory(): Promise<ChatSession[]> {
    return fetchApi<ChatSession[]>('/ai/history');
  },

  async getSessionMessages(sessionId: string): Promise<{ session: ChatSession; messages: ChatMessage[] }> {
    return fetchApi(`/ai/sessions/${sessionId}/messages`);
  },

  // Translation & Simplification
  async translate(params: { text: string; sourceLang: string; targetLang: string }): Promise<{
    translatedText: string;
    simplifiedExplanation: string;
    keyVocabulary: { original: string; translated: string; definition: string }[];
    verificationNote: string;
  }> {
    return fetchApi('/ai/translate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getTranslationHistory(): Promise<TranslationRecord[]> {
    return fetchApi<TranslationRecord[]>('/ai/translations');
  },

  async simplify(params: { text: string; language?: string; difficulty?: string }): Promise<{
    simplifiedText: string;
    analog: string;
    keyPoints: string[];
  }> {
    return fetchApi('/ai/simplify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Quizzes
  async generateQuiz(params: {
    subjectId?: string;
    topicId?: string;
    difficulty?: string;
    language?: string;
    questionCount?: number;
  }): Promise<{ quiz: Quiz; questions: Question[] }> {
    return fetchApi('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getQuizzes(subjectId?: string, topicId?: string): Promise<Quiz[]> {
    const q = new URLSearchParams();
    if (subjectId) q.set('subjectId', subjectId);
    if (topicId) q.set('topicId', topicId);
    const query = q.toString() ? `?${q.toString()}` : '';
    return fetchApi<Quiz[]>(`/quizzes${query}`);
  },

  async getQuiz(id: string): Promise<{ quiz: Quiz; questions: Question[] }> {
    return fetchApi(`/quizzes/${id}`);
  },

  async submitQuiz(quizId: string, answers: { questionId: string; selectedOptionIndex: number }[]): Promise<{
    attempt: QuizAttempt;
    detailedReview: EvaluatedAnswer[];
  }> {
    return fetchApi(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  async getMyAttempts(): Promise<QuizAttempt[]> {
    return fetchApi<QuizAttempt[]>('/quizzes/attempts/my');
  },

  async getAttemptDetails(attemptId: string): Promise<{ attempt: QuizAttempt; quiz: Quiz }> {
    return fetchApi(`/quizzes/attempts/${attemptId}`);
  },

  // Progress
  async getProgressOverview(): Promise<ProgressOverview> {
    return fetchApi<ProgressOverview>('/progress/overview');
  },

  async getSubjectProgress(): Promise<SubjectProgress[]> {
    return fetchApi<SubjectProgress[]>('/progress/subjects');
  },

  // Teacher
  async getTeacherStudents(): Promise<TeacherStudentItem[]> {
    return fetchApi<TeacherStudentItem[]>('/teacher/students');
  },

  async getStudentProgressDetails(studentId: string): Promise<{
    student: User;
    attempts: QuizAttempt[];
    progressList: any[];
    topics: Topic[];
  }> {
    return fetchApi(`/teacher/students/${studentId}/progress`);
  },

  async getClassSummary(): Promise<{
    totalStudents: number;
    totalQuizzesCompleted: number;
    classAverageScore: number;
    commonWeakConcepts: { concept: string; count: number }[];
  }> {
    return fetchApi('/teacher/class-summary');
  },

  async recommendTopic(studentId: string, note: string): Promise<any> {
    return fetchApi('/teacher/recommend', {
      method: 'POST',
      body: JSON.stringify({ studentId, note }),
    });
  },

  // Admin
  async getAdminOverview(): Promise<{
    totalUsers: number;
    studentCount: number;
    teacherCount: number;
    adminCount: number;
    totalSubjects: number;
    totalTopics: number;
    totalQuizzes: number;
    totalQuizAttempts: number;
  }> {
    return fetchApi('/admin/overview');
  },

  async getAdminUsers(): Promise<User[]> {
    return fetchApi<User[]>('/admin/users');
  },

  async updateRole(userId: string, role: string): Promise<User> {
    return fetchApi<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};
