// LearnReach AI - Relational JSON-backed Persistence Engine
// Supports persistent storage on disk for users, quizzes, attempts, progress, chat sessions and assignments

import fs from 'fs';
import path from 'path';
import { getSeedData } from '../prisma/seed.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app_db.json');

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile?: StudentProfileEntity;
}

export interface StudentProfileEntity {
  id: string;
  userId: string;
  preferredLanguage: string; // 'en' | 'hi' | 'or' | 'bn'
  learningLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  gradeLevel: string;
  villageOrRegion?: string;
  schoolName?: string;
  dailyGoalMinutes: number;
  streakDays: number;
  totalPoints: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectEntity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  grade: string;
  order: number;
}

export interface TopicEntity {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  order: number;
}

export interface LessonEntity {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  content: string;
  keyPoints: string[];
  practicalExample: string;
  ruralContextNote: string;
}

export interface ChatSessionEntity {
  id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  language: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageEntity {
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

export interface QuestionEntity {
  id: string;
  quizId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topicConcept: string;
}

export interface QuizEntity {
  id: string;
  title: string;
  subjectId: string;
  topicId?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  questionCount: number;
  isAiGenerated: boolean;
  createdAt: string;
  questions?: QuestionEntity[];
}

export interface QuizAttemptEntity {
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

export interface LearningProgressEntity {
  id: string;
  userId: string;
  topicId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  masteryScore: number;
  lastStudiedAt: string;
}

export interface TeacherAssignmentEntity {
  id: string;
  teacherId: string;
  studentId: string;
  note?: string;
  assignedAt: string;
}

export interface TranslationRecordEntity {
  id: string;
  userId: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  simplifiedText?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserEntity[];
  subjects: SubjectEntity[];
  topics: TopicEntity[];
  lessons: LessonEntity[];
  quizzes: QuizEntity[];
  questions: QuestionEntity[];
  quizAttempts: QuizAttemptEntity[];
  chatSessions: ChatSessionEntity[];
  chatMessages: ChatMessageEntity[];
  learningProgress: LearningProgressEntity[];
  teacherAssignments: TeacherAssignmentEntity[];
  translations: TranslationRecordEntity[];
}

class AppDatabase {
  private data: DatabaseSchema = {
    users: [],
    subjects: [],
    topics: [],
    lessons: [],
    quizzes: [],
    questions: [],
    quizAttempts: [],
    chatSessions: [],
    chatMessages: [],
    learningProgress: [],
    teacherAssignments: [],
    translations: [],
  };

  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private async ensureInitialized() {
    if (this.initialized) return;
    this.ensureDataDir();

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.initialized = true;
        return;
      } catch (err) {
        console.error('Failed reading existing db file, reseeding:', err);
      }
    }

    // Seed initial data
    const seed = await getSeedData();
    this.data.users = seed.users as UserEntity[];
    this.data.subjects = seed.subjects as SubjectEntity[];
    this.data.topics = seed.topics as TopicEntity[];
    this.data.lessons = seed.lessons as LessonEntity[];

    // Flatten quizzes and questions
    for (const q of seed.quizzes) {
      const { questions, ...quizOnly } = q;
      this.data.quizzes.push({
        ...quizOnly,
        createdAt: new Date().toISOString()
      } as QuizEntity);
      if (questions) {
        for (const item of questions) {
          this.data.questions.push({
            ...item,
            quizId: q.id
          });
        }
      }
    }

    // Initial teacher-student assignment for demo
    this.data.teacherAssignments.push({
      id: 'asgn_1',
      teacherId: 'usr_teacher_anita',
      studentId: 'usr_student_priya',
      note: 'Focus on fractions and photosynthesis basics before weekly evaluation.',
      assignedAt: new Date().toISOString()
    });
    this.data.teacherAssignments.push({
      id: 'asgn_2',
      teacherId: 'usr_teacher_anita',
      studentId: 'usr_student_rohit',
      note: 'Advanced quiz practice in science recommended.',
      assignedAt: new Date().toISOString()
    });

    // Initial learning progress for demo students
    this.data.learningProgress.push(
      {
        id: 'prog_1',
        userId: 'usr_student_priya',
        topicId: 'top_fractions',
        status: 'IN_PROGRESS',
        masteryScore: 65,
        lastStudiedAt: new Date().toISOString()
      },
      {
        id: 'prog_2',
        userId: 'usr_student_priya',
        topicId: 'top_photosynthesis',
        status: 'COMPLETED',
        masteryScore: 85,
        lastStudiedAt: new Date().toISOString()
      },
      {
        id: 'prog_3',
        userId: 'usr_student_rohit',
        topicId: 'top_photosynthesis',
        status: 'COMPLETED',
        masteryScore: 92,
        lastStudiedAt: new Date().toISOString()
      }
    );

    // Initial demo quiz attempt
    this.data.quizAttempts.push({
      id: 'att_demo_1',
      quizId: 'quiz_photosynthesis_intro',
      userId: 'usr_student_priya',
      score: 3,
      totalQuestions: 4,
      percentage: 75,
      weakConcepts: ['Environmental Factors on Plant Growth'],
      recommendations: ['Review how overcast weather restricts chlorophyll sunlight absorption'],
      completedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      answers: [
        { questionId: 'q_photo_1', selectedOptionIndex: 1, isCorrect: true },
        { questionId: 'q_photo_2', selectedOptionIndex: 2, isCorrect: true },
        { questionId: 'q_photo_3', selectedOptionIndex: 1, isCorrect: true },
        { questionId: 'q_photo_4', selectedOptionIndex: 0, isCorrect: false }
      ]
    });

    this.persist();
    this.initialized = true;
  }

  private persist() {
    this.ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // --- Users & Profiles ---
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    await this.ensureInitialized();
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    await this.ensureInitialized();
    const user = this.data.users.find(u => u.id === id);
    return user || null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    await this.ensureInitialized();
    return this.data.users;
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    await this.ensureInitialized();
    this.data.users.push(user);
    this.persist();
    return user;
  }

  async updateUser(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.ensureInitialized();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.users[index];
  }

  async updateStudentProfile(userId: string, updates: Partial<StudentProfileEntity>): Promise<StudentProfileEntity | null> {
    await this.ensureInitialized();
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    if (!user.profile) {
      user.profile = {
        id: 'prof_' + Math.random().toString(36).substring(2, 9),
        userId,
        preferredLanguage: 'en',
        learningLevel: 'BEGINNER',
        gradeLevel: 'Class 8',
        dailyGoalMinutes: 30,
        streakDays: 1,
        totalPoints: 0,
        ...updates
      };
    } else {
      user.profile = { ...user.profile, ...updates };
    }
    this.persist();
    return user.profile;
  }

  // --- Curriculum: Subjects, Topics, Lessons ---
  async getSubjects(): Promise<SubjectEntity[]> {
    await this.ensureInitialized();
    return [...this.data.subjects].sort((a, b) => a.order - b.order);
  }

  async getSubjectById(id: string): Promise<SubjectEntity | null> {
    await this.ensureInitialized();
    return this.data.subjects.find(s => s.id === id) || null;
  }

  async createSubject(subject: SubjectEntity): Promise<SubjectEntity> {
    await this.ensureInitialized();
    this.data.subjects.push(subject);
    this.persist();
    return subject;
  }

  async getTopicsBySubject(subjectId: string): Promise<TopicEntity[]> {
    await this.ensureInitialized();
    return this.data.topics
      .filter(t => t.subjectId === subjectId)
      .sort((a, b) => a.order - b.order);
  }

  async getAllTopics(): Promise<TopicEntity[]> {
    await this.ensureInitialized();
    return this.data.topics;
  }

  async getTopicById(id: string): Promise<TopicEntity | null> {
    await this.ensureInitialized();
    return this.data.topics.find(t => t.id === id) || null;
  }

  async createTopic(topic: TopicEntity): Promise<TopicEntity> {
    await this.ensureInitialized();
    this.data.topics.push(topic);
    this.persist();
    return topic;
  }

  async getLessonByTopicId(topicId: string): Promise<LessonEntity | null> {
    await this.ensureInitialized();
    return this.data.lessons.find(l => l.topicId === topicId) || null;
  }

  async getLessonById(id: string): Promise<LessonEntity | null> {
    await this.ensureInitialized();
    return this.data.lessons.find(l => l.id === id) || null;
  }

  // --- Quizzes and Questions ---
  async getQuizzes(subjectId?: string, topicId?: string): Promise<QuizEntity[]> {
    await this.ensureInitialized();
    return this.data.quizzes.filter(q => {
      if (subjectId && q.subjectId !== subjectId) return false;
      if (topicId && q.topicId !== topicId) return false;
      return true;
    });
  }

  async getQuizById(id: string): Promise<(QuizEntity & { questions: QuestionEntity[] }) | null> {
    await this.ensureInitialized();
    const quiz = this.data.quizzes.find(q => q.id === id);
    if (!quiz) return null;
    const questions = this.data.questions.filter(q => q.quizId === id);
    return { ...quiz, questions };
  }

  async saveGeneratedQuiz(quiz: QuizEntity, questions: QuestionEntity[]): Promise<QuizEntity> {
    await this.ensureInitialized();
    this.data.quizzes.push(quiz);
    for (const q of questions) {
      this.data.questions.push(q);
    }
    this.persist();
    return quiz;
  }

  // --- Quiz Attempts and Answers ---
  async saveQuizAttempt(attempt: QuizAttemptEntity): Promise<QuizAttemptEntity> {
    await this.ensureInitialized();
    this.data.quizAttempts.push(attempt);

    // Update student progress & points
    const user = this.data.users.find(u => u.id === attempt.userId);
    if (user && user.profile) {
      user.profile.totalPoints += attempt.score * 15;
      user.profile.streakDays = Math.max(user.profile.streakDays, 1);
    }

    // Update learning progress for topic
    const quiz = this.data.quizzes.find(q => q.id === attempt.quizId);
    if (quiz && quiz.topicId) {
      const existingProg = this.data.learningProgress.find(
        p => p.userId === attempt.userId && p.topicId === quiz.topicId
      );
      if (existingProg) {
        existingProg.masteryScore = Math.max(existingProg.masteryScore, attempt.percentage);
        existingProg.status = attempt.percentage >= 70 ? 'COMPLETED' : 'IN_PROGRESS';
        existingProg.lastStudiedAt = new Date().toISOString();
      } else {
        this.data.learningProgress.push({
          id: 'prog_' + Math.random().toString(36).substring(2, 9),
          userId: attempt.userId,
          topicId: quiz.topicId,
          status: attempt.percentage >= 70 ? 'COMPLETED' : 'IN_PROGRESS',
          masteryScore: attempt.percentage,
          lastStudiedAt: new Date().toISOString()
        });
      }
    }

    this.persist();
    return attempt;
  }

  async getAttemptsByUserId(userId: string): Promise<QuizAttemptEntity[]> {
    await this.ensureInitialized();
    return this.data.quizAttempts
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  async getAllAttempts(): Promise<QuizAttemptEntity[]> {
    await this.ensureInitialized();
    return this.data.quizAttempts;
  }

  async getAttemptById(id: string): Promise<QuizAttemptEntity | null> {
    await this.ensureInitialized();
    return this.data.quizAttempts.find(a => a.id === id) || null;
  }

  // --- Learning Progress ---
  async getLearningProgressByUserId(userId: string): Promise<LearningProgressEntity[]> {
    await this.ensureInitialized();
    return this.data.learningProgress.filter(p => p.userId === userId);
  }

  async updateTopicProgress(userId: string, topicId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED', masteryScore: number) {
    await this.ensureInitialized();
    let prog = this.data.learningProgress.find(p => p.userId === userId && p.topicId === topicId);
    if (prog) {
      prog.status = status;
      prog.masteryScore = Math.max(prog.masteryScore, masteryScore);
      prog.lastStudiedAt = new Date().toISOString();
    } else {
      prog = {
        id: 'prog_' + Math.random().toString(36).substring(2, 9),
        userId,
        topicId,
        status,
        masteryScore,
        lastStudiedAt: new Date().toISOString()
      };
      this.data.learningProgress.push(prog);
    }
    this.persist();
    return prog;
  }

  // --- Chat Sessions & Messages ---
  async createChatSession(session: ChatSessionEntity): Promise<ChatSessionEntity> {
    await this.ensureInitialized();
    this.data.chatSessions.push(session);
    this.persist();
    return session;
  }

  async getChatSessions(userId: string): Promise<ChatSessionEntity[]> {
    await this.ensureInitialized();
    return this.data.chatSessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getChatSessionById(id: string): Promise<ChatSessionEntity | null> {
    await this.ensureInitialized();
    return this.data.chatSessions.find(s => s.id === id) || null;
  }

  async addChatMessage(message: ChatMessageEntity): Promise<ChatMessageEntity> {
    await this.ensureInitialized();
    this.data.chatMessages.push(message);
    const session = this.data.chatSessions.find(s => s.id === message.sessionId);
    if (session) {
      session.updatedAt = new Date().toISOString();
    }
    this.persist();
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessageEntity[]> {
    await this.ensureInitialized();
    return this.data.chatMessages
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // --- Teacher Assignments ---
  async getStudentsForTeacher(teacherId: string): Promise<{ student: UserEntity; assignment: TeacherAssignmentEntity }[]> {
    await this.ensureInitialized();
    const assignments = this.data.teacherAssignments.filter(a => a.teacherId === teacherId);
    const results: { student: UserEntity; assignment: TeacherAssignmentEntity }[] = [];
    for (const asgn of assignments) {
      const student = this.data.users.find(u => u.id === asgn.studentId);
      if (student) {
        results.push({ student, assignment: asgn });
      }
    }
    return results;
  }

  async assignStudentToTeacher(teacherId: string, studentId: string, note?: string) {
    await this.ensureInitialized();
    let asgn = this.data.teacherAssignments.find(a => a.teacherId === teacherId && a.studentId === studentId);
    if (asgn) {
      asgn.note = note || asgn.note;
    } else {
      asgn = {
        id: 'asgn_' + Math.random().toString(36).substring(2, 9),
        teacherId,
        studentId,
        note,
        assignedAt: new Date().toISOString()
      };
      this.data.teacherAssignments.push(asgn);
    }
    this.persist();
    return asgn;
  }

  // --- Translations ---
  async addTranslationRecord(record: TranslationRecordEntity): Promise<TranslationRecordEntity> {
    await this.ensureInitialized();
    this.data.translations.push(record);
    this.persist();
    return record;
  }

  async getTranslationsByUserId(userId: string): Promise<TranslationRecordEntity[]> {
    await this.ensureInitialized();
    return this.data.translations
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const db = new AppDatabase();
