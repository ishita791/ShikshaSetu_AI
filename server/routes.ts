// LearnReach AI - Express API Router
// REST endpoints for Auth, Subjects, AI Tutor, Quizzes, Progress, Teacher, Admin

import { Router, Request, Response } from 'express';
import { db } from './db.ts';
import {
  requireAuth,
  requireRole,
  hashPassword,
  verifyPassword,
  generateToken,
  registerSchema,
  loginSchema,
  AuthRequest
} from './auth.ts';
import {
  getTutoringAdvice,
  translateContent,
  simplifyText,
  generateSmartQuizQuestions
} from './ai.ts';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { name, email, password, role, preferredLanguage, learningLevel, gradeLevel, villageOrRegion, schoolName } = parsed.data;

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const userId = 'usr_' + Math.random().toString(36).substring(2, 10);

    const newUser = await db.createUser({
      id: userId,
      email,
      passwordHash,
      name,
      role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: 'prof_' + Math.random().toString(36).substring(2, 9),
        userId,
        preferredLanguage,
        learningLevel,
        gradeLevel,
        villageOrRegion: villageOrRegion || 'Rural Learning Cluster',
        schoolName: schoolName || 'Community Learning Center',
        dailyGoalMinutes: 30,
        streakDays: 1,
        totalPoints: 50,
      }
    });

    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to register account.' });
  }
});

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }
    const { passwordHash: _, ...safeUser } = user;
    return res.json(safeUser);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

apiRouter.put('/auth/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, preferredLanguage, learningLevel, gradeLevel, dailyGoalMinutes, villageOrRegion, schoolName } = req.body;
    if (name) {
      await db.updateUser(req.user!.id, { name });
    }
    const updatedProfile = await db.updateStudentProfile(req.user!.id, {
      preferredLanguage,
      learningLevel,
      gradeLevel,
      dailyGoalMinutes: typeof dailyGoalMinutes === 'number' ? dailyGoalMinutes : 30,
      villageOrRegion,
      schoolName,
    });
    const user = await db.findUserById(req.user!.id);
    const { passwordHash: _, ...safeUser } = user!;
    return res.json(safeUser);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile settings.' });
  }
});

// ==========================================
// 2. CURRICULUM: SUBJECTS, TOPICS & LESSONS
// ==========================================

apiRouter.get('/subjects', async (_req: Request, res: Response) => {
  try {
    const subjects = await db.getSubjects();
    const topics = await db.getAllTopics();
    const result = subjects.map(s => ({
      ...s,
      topicCount: topics.filter(t => t.subjectId === s.id).length
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch subjects.' });
  }
});

apiRouter.get('/subjects/:id', async (req: Request, res: Response) => {
  try {
    const subject = await db.getSubjectById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found.' });
    return res.json(subject);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch subject.' });
  }
});

apiRouter.get('/subjects/:id/topics', async (req: Request, res: Response) => {
  try {
    const topics = await db.getTopicsBySubject(req.params.id);
    return res.json(topics);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch topics.' });
  }
});

apiRouter.get('/topics/:id/lesson', async (req: Request, res: Response) => {
  try {
    const lesson = await db.getLessonByTopicId(req.params.id);
    const topic = await db.getTopicById(req.params.id);
    if (!lesson) {
      return res.json({
        id: 'les_generated_' + req.params.id,
        topicId: req.params.id,
        title: topic ? topic.title : 'Lesson Overview',
        summary: topic ? topic.description : 'Foundational study concept.',
        content: `Welcome to this module on ${topic ? topic.title : 'this topic'}. Review the key concepts and interact with your AI tutor to clarify doubts in your regional language.`,
        keyPoints: [
          'Understand the core definition and practical significance.',
          'Identify how this concept is observed in everyday life.',
          'Practice with the self-assessment quiz to reinforce retention.'
        ],
        practicalExample: 'Observe how this principle operates in household work, rural trade, and local agriculture.',
        ruralContextNote: 'Tailored for practical understanding without requiring specialized lab equipment.'
      });
    }
    return res.json(lesson);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lesson.' });
  }
});

// ==========================================
// 3. AI PERSONAL TUTOR & MULTILINGUAL TOOLS
// ==========================================

apiRouter.post('/ai/chat', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, message, subjectId, topicId, language, difficulty } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const user = await db.findUserById(req.user!.id);
    const preferredLang = language || user?.profile?.preferredLanguage || 'en';
    const activeDifficulty = difficulty || user?.profile?.learningLevel || 'BEGINNER';

    let subjectName = 'General';
    let topicName = 'General Learning';
    if (subjectId) {
      const s = await db.getSubjectById(subjectId);
      if (s) subjectName = s.name;
    }
    if (topicId) {
      const t = await db.getTopicById(topicId);
      if (t) topicName = t.title;
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newSession = await db.createChatSession({
        id: 'sess_' + Math.random().toString(36).substring(2, 10),
        userId: req.user!.id,
        subjectId,
        topicId,
        language: preferredLang,
        difficulty: activeDifficulty,
        title: `${topicName} Discussion`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      activeSessionId = newSession.id;
    }

    // Save student message
    await db.addChatMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 10),
      sessionId: activeSessionId,
      role: 'user',
      content: message,
      language: preferredLang,
      createdAt: new Date().toISOString(),
    });

    // Get previous messages in session
    const history = await db.getChatMessages(activeSessionId);
    const simpleHistory = history.map(h => ({ role: h.role, content: h.content }));

    // Request AI Tutoring response
    const tutorResponse = await getTutoringAdvice({
      message,
      subject: subjectName,
      topic: topicName,
      language: preferredLang,
      difficulty: activeDifficulty,
      gradeLevel: user?.profile?.gradeLevel || 'Class 8',
      history: simpleHistory,
    });

    // Save AI tutor message
    const botMsg = await db.addChatMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 10),
      sessionId: activeSessionId,
      role: 'assistant',
      content: tutorResponse.content,
      language: preferredLang,
      stepByStepExplanation: tutorResponse.stepByStepExplanation,
      practicalExample: tutorResponse.practicalExample,
      suggestedQuestions: tutorResponse.suggestedQuestions,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      sessionId: activeSessionId,
      message: botMsg,
    });
  } catch (err: any) {
    console.error('AI Chat endpoint error:', err);
    return res.status(500).json({ error: 'Failed to process tutoring request.' });
  }
});

apiRouter.get('/ai/history', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await db.getChatSessions(req.user!.id);
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
});

apiRouter.get('/ai/sessions/:id/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const session = await db.getChatSessionById(req.params.id);
    if (!session || session.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    const messages = await db.getChatMessages(req.params.id);
    return res.json({ session, messages });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

apiRouter.post('/ai/translate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ error: 'Text, source language, and target language are required.' });
    }

    const result = await translateContent({ text, sourceLang, targetLang });

    // Store translation history for user
    await db.addTranslationRecord({
      id: 'tr_' + Math.random().toString(36).substring(2, 10),
      userId: req.user!.id,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      originalText: text,
      translatedText: result.translatedText,
      simplifiedText: result.simplifiedExplanation,
      createdAt: new Date().toISOString(),
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Translation request failed.' });
  }
});

apiRouter.get('/ai/translations', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const history = await db.getTranslationsByUserId(req.user!.id);
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch translation history.' });
  }
});

apiRouter.post('/ai/simplify', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { text, language, difficulty } = req.body;
    if (!text) return res.status(400).json({ error: 'Text to simplify is required.' });

    const result = await simplifyText({ text, language: language || 'en', difficulty });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to simplify text.' });
  }
});

// ==========================================
// 4. SMART QUIZ GENERATOR & ASSESSMENT
// ==========================================

apiRouter.post('/quizzes/generate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { subjectId, topicId, difficulty, language, questionCount } = req.body;

    const subject = subjectId ? await db.getSubjectById(subjectId) : null;
    const topic = topicId ? await db.getTopicById(topicId) : null;

    const subjectName = subject ? subject.name : 'General Science';
    const topicName = topic ? topic.title : 'Everyday Concepts';

    // Retrieve previous student attempts to find weak concepts
    const previousAttempts = await db.getAttemptsByUserId(req.user!.id);
    const weakConcepts = Array.from(new Set(previousAttempts.flatMap(a => a.weakConcepts))).slice(0, 3);

    const questionsData = await generateSmartQuizQuestions({
      subject: subjectName,
      topic: topicName,
      difficulty: difficulty || 'BEGINNER',
      language: language || 'en',
      questionCount: questionCount || 4,
      studentWeakConcepts: weakConcepts,
    });

    const quizId = 'quiz_' + Math.random().toString(36).substring(2, 10);
    const newQuiz = {
      id: quizId,
      title: `${topicName} - Smart Practice Quiz`,
      subjectId: subjectId || 'subj_science',
      topicId,
      difficulty: (difficulty || 'BEGINNER') as any,
      language: language || 'en',
      questionCount: questionsData.length,
      isAiGenerated: true,
      createdAt: new Date().toISOString(),
    };

    const savedQuestions = questionsData.map((q, idx) => ({
      id: `q_${quizId}_${idx + 1}`,
      quizId,
      prompt: q.prompt,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      topicConcept: q.topicConcept,
    }));

    await db.saveGeneratedQuiz(newQuiz, savedQuestions);

    // Return sanitized quiz to client (WITHOUT correctOptionIndex and explanations!)
    return res.json({
      quiz: newQuiz,
      questions: savedQuestions.map(q => ({
        id: q.id,
        quizId: q.quizId,
        prompt: q.prompt,
        options: q.options,
        topicConcept: q.topicConcept,
      })),
    });
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

apiRouter.get('/quizzes', requireAuth, async (req: Request, res: Response) => {
  try {
    const { subjectId, topicId } = req.query as { subjectId?: string; topicId?: string };
    const quizzes = await db.getQuizzes(subjectId, topicId);
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list quizzes.' });
  }
});

apiRouter.get('/quizzes/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const quizWithQuestions = await db.getQuizById(req.params.id);
    if (!quizWithQuestions) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    // Sanitize questions so correct answers are not exposed before submission
    const sanitizedQuestions = quizWithQuestions.questions.map(q => ({
      id: q.id,
      quizId: q.quizId,
      prompt: q.prompt,
      options: q.options,
      topicConcept: q.topicConcept,
    }));

    const { questions: _, ...quizData } = quizWithQuestions;
    return res.json({ quiz: quizData, questions: sanitizedQuestions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch quiz.' });
  }
});

/**
 * Quiz Submission - Validates answers and computes scores on the server
 */
apiRouter.post('/quizzes/:id/submit', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body as {
      answers: { questionId: string; selectedOptionIndex: number }[];
    };

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array of submissions.' });
    }

    const quizWithQuestions = await db.getQuizById(req.params.id);
    if (!quizWithQuestions) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    let score = 0;
    const evaluatedAnswers: {
      questionId: string;
      selectedOptionIndex: number;
      isCorrect: boolean;
      correctOptionIndex: number;
      explanation: string;
      prompt: string;
      topicConcept: string;
    }[] = [];

    const weakConcepts: string[] = [];

    for (const q of quizWithQuestions.questions) {
      const studentAns = answers.find(a => a.questionId === q.id);
      const selectedIndex = studentAns ? studentAns.selectedOptionIndex : -1;
      const isCorrect = selectedIndex === q.correctOptionIndex;

      if (isCorrect) {
        score++;
      } else {
        weakConcepts.push(q.topicConcept || 'General Concept');
      }

      evaluatedAnswers.push({
        questionId: q.id,
        selectedOptionIndex: selectedIndex,
        isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        prompt: q.prompt,
        topicConcept: q.topicConcept,
      });
    }

    const totalQuestions = quizWithQuestions.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Adaptive Learning Algorithm
    const recommendations: string[] = [];
    if (percentage < 50) {
      recommendations.push(
        'Score below 50%: Foundational revision recommended. Review the step-by-step topic lesson and ask the AI Tutor for simpler everyday examples before retrying.'
      );
      if (weakConcepts.length > 0) {
        recommendations.push(`Targeted revision needed for: ${Array.from(new Set(weakConcepts)).join(', ')}.`);
      }
    } else if (percentage < 80) {
      recommendations.push(
        'Score 50%–79%: Good progress! Targeted practice on incorrect questions will bridge your learning gap.'
      );
      if (weakConcepts.length > 0) {
        recommendations.push(`Review the detailed explanations for: ${Array.from(new Set(weakConcepts)).join(', ')}.`);
      }
    } else {
      recommendations.push(
        'Score 80%+: Outstanding comprehension! You have mastered this module. We recommend moving to the next lesson or trying an advanced difficulty challenge.'
      );
    }

    const attemptId = 'att_' + Math.random().toString(36).substring(2, 10);
    const attemptRecord = {
      id: attemptId,
      quizId: quizWithQuestions.id,
      userId: req.user!.id,
      score,
      totalQuestions,
      percentage,
      weakConcepts: Array.from(new Set(weakConcepts)),
      recommendations,
      completedAt: new Date().toISOString(),
      answers: evaluatedAnswers.map(a => ({
        questionId: a.questionId,
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect: a.isCorrect,
      })),
    };

    await db.saveQuizAttempt(attemptRecord);

    return res.json({
      attempt: attemptRecord,
      detailedReview: evaluatedAnswers,
    });
  } catch (err: any) {
    console.error('Submit quiz error:', err);
    return res.status(500).json({ error: 'Failed to evaluate quiz submission.' });
  }
});

apiRouter.get('/quizzes/attempts/my', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await db.getAttemptsByUserId(req.user!.id);
    return res.json(attempts);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch attempts.' });
  }
});

apiRouter.get('/quizzes/attempts/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await db.getAttemptById(req.params.id);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

    // Ensure students can only review their own attempts (teachers & admins can review any)
    if (req.user!.role === 'STUDENT' && attempt.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const quiz = await db.getQuizById(attempt.quizId);
    return res.json({ attempt, quiz });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load attempt details.' });
  }
});

// ==========================================
// 5. PROGRESS & ANALYTICS
// ==========================================

apiRouter.get('/progress/overview', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.findUserById(req.user!.id);
    const progressList = await db.getLearningProgressByUserId(req.user!.id);
    const attempts = await db.getAttemptsByUserId(req.user!.id);
    const subjects = await db.getSubjects();
    const topics = await db.getAllTopics();

    const completedTopics = progressList.filter(p => p.status === 'COMPLETED').length;
    const inProgressTopics = progressList.filter(p => p.status === 'IN_PROGRESS').length;

    const totalScores = attempts.reduce((acc, a) => acc + a.percentage, 0);
    const averageScore = attempts.length > 0 ? Math.round(totalScores / attempts.length) : 0;

    const allWeakConcepts = Array.from(new Set(attempts.flatMap(a => a.weakConcepts)));

    // Find recommended next topic (first topic not yet completed)
    const completedTopicIds = new Set(progressList.filter(p => p.status === 'COMPLETED').map(p => p.topicId));
    const nextTopic = topics.find(t => !completedTopicIds.has(t.id)) || topics[0];

    return res.json({
      studentName: user?.name,
      streakDays: user?.profile?.streakDays || 1,
      totalPoints: user?.profile?.totalPoints || 0,
      dailyGoalMinutes: user?.profile?.dailyGoalMinutes || 30,
      completedTopicsCount: completedTopics,
      inProgressTopicsCount: inProgressTopics,
      totalTopicsCount: topics.length,
      totalQuizzesTaken: attempts.length,
      averageScore,
      weakConcepts: allWeakConcepts.slice(0, 4),
      recommendedNextLesson: nextTopic ? {
        id: nextTopic.id,
        title: nextTopic.title,
        subjectId: nextTopic.subjectId,
        subjectName: subjects.find(s => s.id === nextTopic.subjectId)?.name || 'General',
      } : null,
      recentAttempts: attempts.slice(0, 5),
    });
  } catch (err) {
    console.error('Progress overview error:', err);
    return res.status(500).json({ error: 'Failed to load progress overview.' });
  }
});

apiRouter.get('/progress/subjects', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await db.getSubjects();
    const topics = await db.getAllTopics();
    const progressList = await db.getLearningProgressByUserId(req.user!.id);
    const attempts = await db.getAttemptsByUserId(req.user!.id);

    const subjectStats = subjects.map(s => {
      const subjectTopics = topics.filter(t => t.subjectId === s.id);
      const subjectTopicIds = new Set(subjectTopics.map(t => t.id));

      const subjectProgress = progressList.filter(p => subjectTopicIds.has(p.topicId));
      const completed = subjectProgress.filter(p => p.status === 'COMPLETED').length;

      const subjectAttempts = attempts.filter(a => {
        const topic = topics.find(t => t.id === a.quizId || subjectTopicIds.has(t.id));
        return !!topic;
      });

      const avgScore = subjectAttempts.length > 0
        ? Math.round(subjectAttempts.reduce((sum, a) => sum + a.percentage, 0) / subjectAttempts.length)
        : 70;

      return {
        subjectId: s.id,
        subjectName: s.name,
        code: s.code,
        icon: s.icon,
        totalTopics: subjectTopics.length,
        completedTopics: completed,
        completionPercentage: subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0,
        averageScore: avgScore,
      };
    });

    return res.json(subjectStats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load subject progress.' });
  }
});

// ==========================================
// 6. TEACHER DASHBOARD ROUTES
// ==========================================

apiRouter.get('/teacher/students', requireAuth, requireRole('TEACHER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const assignments = await db.getStudentsForTeacher(req.user!.id);
    const allUsers = await db.getAllUsers();
    const studentsList = assignments.length > 0 
      ? assignments.map(a => a.student)
      : allUsers.filter(u => u.role === 'STUDENT'); // Demo fallback if teacher has no explicit assignments yet

    const attempts = await db.getAllAttempts();

    const result = studentsList.map(st => {
      const stAttempts = attempts.filter(a => a.userId === st.id);
      const avgScore = stAttempts.length > 0
        ? Math.round(stAttempts.reduce((sum, a) => sum + a.percentage, 0) / stAttempts.length)
        : 0;

      const weakConcepts = Array.from(new Set(stAttempts.flatMap(a => a.weakConcepts)));

      return {
        id: st.id,
        name: st.name,
        email: st.email,
        avatarUrl: st.avatarUrl,
        gradeLevel: st.profile?.gradeLevel || 'Class 8',
        preferredLanguage: st.profile?.preferredLanguage || 'en',
        villageOrRegion: st.profile?.villageOrRegion || 'Regional Cluster',
        quizzesTaken: stAttempts.length,
        averageScore: avgScore,
        streakDays: st.profile?.streakDays || 1,
        weakConcepts,
      };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch student roster.' });
  }
});

apiRouter.get('/teacher/students/:id/progress', requireAuth, requireRole('TEACHER', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const student = await db.findUserById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const attempts = await db.getAttemptsByUserId(req.params.id);
    const progressList = await db.getLearningProgressByUserId(req.params.id);
    const topics = await db.getAllTopics();

    const { passwordHash: _, ...safeStudent } = student;
    return res.json({
      student: safeStudent,
      attempts,
      progressList,
      topics,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch student progress.' });
  }
});

apiRouter.get('/teacher/class-summary', requireAuth, requireRole('TEACHER', 'ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const allUsers = await db.getAllUsers();
    const students = allUsers.filter(u => u.role === 'STUDENT');
    const attempts = await db.getAllAttempts();

    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0;

    const weakConceptCounts: Record<string, number> = {};
    for (const a of attempts) {
      for (const c of a.weakConcepts) {
        weakConceptCounts[c] = (weakConceptCounts[c] || 0) + 1;
      }
    }

    const sortedWeak = Object.entries(weakConceptCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([concept, count]) => ({ concept, count }));

    return res.json({
      totalStudents: students.length,
      totalQuizzesCompleted: attempts.length,
      classAverageScore: avgScore,
      commonWeakConcepts: sortedWeak.slice(0, 5),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load class summary.' });
  }
});

apiRouter.post('/teacher/recommend', requireAuth, requireRole('TEACHER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, note } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Student ID required.' });

    const updatedAsgn = await db.assignStudentToTeacher(req.user!.id, studentId, note);
    return res.json({ success: true, assignment: updatedAsgn });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit recommendation.' });
  }
});

// ==========================================
// 7. ADMIN DASHBOARD ROUTES
// ==========================================

apiRouter.get('/admin/overview', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await db.getAllUsers();
    const subjects = await db.getSubjects();
    const topics = await db.getAllTopics();
    const quizzes = await db.getQuizzes();
    const attempts = await db.getAllAttempts();

    const studentCount = users.filter(u => u.role === 'STUDENT').length;
    const teacherCount = users.filter(u => u.role === 'TEACHER').length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;

    return res.json({
      totalUsers: users.length,
      studentCount,
      teacherCount,
      adminCount,
      totalSubjects: subjects.length,
      totalTopics: topics.length,
      totalQuizzes: quizzes.length,
      totalQuizAttempts: attempts.length,
      sdg4InitiativeActive: true,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load admin metrics.' });
  }
});

apiRouter.get('/admin/users', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await db.getAllUsers();
    const safeUsers = users.map(({ passwordHash: _, ...u }) => u);
    return res.json(safeUsers);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list users.' });
  }
});

apiRouter.patch('/admin/users/:id/role', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    const updated = await db.updateUser(req.params.id, { role });
    if (!updated) return res.status(404).json({ error: 'User not found.' });
    const { passwordHash: _, ...safeUser } = updated;
    return res.json(safeUser);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
});
