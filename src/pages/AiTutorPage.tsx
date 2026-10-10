// LearnReach AI - Interactive AI Personal Tutor
// Features step-by-step pedagogy, regional linguistic adaptation, everyday rural analogies

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Subject, Topic, ChatSession, ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  ChevronRight,
  Languages, 
  MessageSquare, 
  User, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const AiTutorPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj_science');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('top_photosynthesis');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(user?.profile?.preferredLanguage || 'hi');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(user?.profile?.learningLevel || 'BEGINNER');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load subjects and topics on mount
  useEffect(() => {
    async function loadCurriculum() {
      try {
        const subs = await api.getSubjects();
        setSubjects(subs);
        if (subs.length > 0) {
          const subId = subs[0].id;
          setSelectedSubjectId(subId);
          const topList = await api.getTopics(subId);
          setTopics(topList);
          if (topList.length > 0) {
            setSelectedTopicId(topList[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load curriculum:', err);
      }
    }
    loadCurriculum();
  }, []);

  // When subject changes, fetch its topics
  const handleSubjectChange = async (subjId: string) => {
    setSelectedSubjectId(subjId);
    try {
      const topList = await api.getTopics(subjId);
      setTopics(topList);
      if (topList.length > 0) {
        setSelectedTopicId(topList[0].id);
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  // Load past chat sessions
  useEffect(() => {
    async function loadSessions() {
      try {
        const list = await api.getChatHistory();
        setSessions(list);
        if (list.length > 0 && !activeSessionId) {
          setActiveSessionId(list[0].id);
          const detail = await api.getSessionMessages(list[0].id);
          setMessages(detail.messages);
        }
      } catch (err) {
        console.warn('Could not load chat history:', err);
      }
    }
    loadSessions();
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle location state if coming with pre-filled message/topic
  useEffect(() => {
    if (location.state?.message) {
      handleSendMessage(location.state.message);
    }
  }, [location.state]);

  const handleSelectSession = async (sessId: string) => {
    setActiveSessionId(sessId);
    setLoading(true);
    try {
      const detail = await api.getSessionMessages(sessId);
      setMessages(detail.messages);
      if (detail.session.subjectId) setSelectedSubjectId(detail.session.subjectId);
      if (detail.session.topicId) setSelectedTopicId(detail.session.topicId);
      if (detail.session.language) setSelectedLanguage(detail.session.language);
      if (detail.session.difficulty) setSelectedDifficulty(detail.session.difficulty);
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    setError(null);
    setInputText('');

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: 'tmp_' + Date.now(),
      sessionId: activeSessionId || 'pending',
      role: 'user',
      content: textToSend,
      language: selectedLanguage,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await api.sendChatMessage({
        sessionId: activeSessionId || undefined,
        message: textToSend,
        subjectId: selectedSubjectId,
        topicId: selectedTopicId,
        language: selectedLanguage,
        difficulty: selectedDifficulty,
      });

      setActiveSessionId(response.sessionId);
      // Replace or append assistant message
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, response.message]);

      // Refresh sessions list
      const list = await api.getChatHistory();
      setSessions(list);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'The AI Tutor encountered a problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Controls Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-teal-600" />
              <span>AI Personal Tutor</span>
            </h1>
            <p className="text-xs text-slate-500">
              Interactive explanations adapted to your grade, regional language, and understanding
            </p>
          </div>

          <button
            onClick={handleStartNewChat}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-teal-200 text-teal-800 bg-teal-50/60 hover:bg-teal-100 transition-colors self-start md:self-auto"
          >
            + Start New Conversation
          </button>
        </div>

        {/* Configuration Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          
          {/* Subject */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Module / Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Regional Language */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-teal-900"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="or">Odia (ଓଡ଼ିଆ)</option>
              <option value="bn">Bengali (বাংলা)</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Pedagogy Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="BEGINNER">Beginner (Foundational)</option>
              <option value="INTERMEDIATE">Intermediate (Standard)</option>
              <option value="ADVANCED">Advanced (Challenging)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Recent Chat History (3 cols on desktop) */}
        <div className="hidden lg:block lg:col-span-3 bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 pb-2 border-b border-stone-100">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              Past Conversations
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {sessions.length} sessions
            </span>
          </div>

          {sessions.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No previous chats yet. Ask your first question!
            </p>
          ) : (
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${activeSessionId === s.id ? 'bg-teal-50 border border-teal-200 text-teal-900 font-medium' : 'hover:bg-stone-50 text-slate-600'}`}
                >
                  <span className="truncate">{s.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Chat Stream & Interactive Prompter (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-stone-200/90 rounded-2xl shadow-xs flex flex-col h-[650px] overflow-hidden">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-500">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-base font-bold text-slate-900">
                    How can I help you learn today?
                  </h3>
                  <p className="text-xs text-slate-600">
                    Ask any question regarding your lesson. You can also pick one of the sample questions below:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full text-left pt-2">
                  <button
                    onClick={() => handleSendMessage('Can you explain this topic step-by-step from the very beginning?')}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 text-xs text-slate-700 transition-colors"
                  >
                    💡 "Explain this topic step-by-step from the very beginning"
                  </button>
                  <button
                    onClick={() => handleSendMessage('Give me a simple village or everyday nature example for this concept.')}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 text-xs text-slate-700 transition-colors"
                  >
                    🌾 "Give me an everyday nature example"
                  </button>
                  <button
                    onClick={() => handleSendMessage('What is the biggest mistake students make in this subject?')}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 text-xs text-slate-700 transition-colors"
                  >
                    ⚠️ "What is the biggest mistake students make?"
                  </button>
                  <button
                    onClick={() => handleSendMessage('Give me a quick practice question to test my understanding.')}
                    className="p-3 bg-white border border-stone-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 text-xs text-slate-700 transition-colors"
                  >
                    📝 "Give me a quick practice question"
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-3 max-w-2xl ${m.role === 'user' ? 'bg-teal-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-sm' : 'bg-white border border-stone-200 p-5 rounded-2xl rounded-tl-xs shadow-xs text-slate-800'}`}>
                    
                    {/* Primary Content */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>

                    {/* Step-by-Step Breakdown (Assistant only) */}
                    {m.role === 'assistant' && m.stepByStepExplanation && (
                      <div className="p-3.5 bg-stone-50 border border-stone-200/90 rounded-xl space-y-1.5 text-xs text-slate-700">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                          <span>Step-by-Step Breakdown</span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed text-slate-600">
                          {m.stepByStepExplanation}
                        </div>
                      </div>
                    )}

                    {/* Practical Example (Assistant only) */}
                    {m.role === 'assistant' && m.practicalExample && (
                      <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-1 text-xs text-teal-950">
                        <div className="font-semibold text-teal-900 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
                          <span>Everyday Rural Analogy</span>
                        </div>
                        <p className="leading-relaxed text-teal-900">
                          {m.practicalExample}
                        </p>
                      </div>
                    )}

                    {/* Suggested Follow-up Questions (Assistant only) */}
                    {m.role === 'assistant' && m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                      <div className="pt-2 space-y-1.5 border-t border-stone-100">
                        <div className="text-[11px] font-medium text-slate-400">
                          Suggested follow-up questions:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-md border border-stone-200 transition-colors text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions (Copy) */}
                    {m.role === 'assistant' && (
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-stone-100">
                        <span>Language: {m.language.toUpperCase()}</span>
                        <button
                          onClick={() => handleCopyText(m.content, m.id)}
                          className="hover:text-slate-700 flex items-center gap-1"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy explanation</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-stone-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span>LearnReach AI is formulating a patient, step-by-step explanation...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helper Action Buttons */}
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 shrink-0 font-medium">Quick prompt:</span>
            <button
              onClick={() => handleSendMessage('Can you explain this more simply in everyday words?')}
              disabled={loading}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-md hover:bg-stone-100 text-slate-700 shrink-0 disabled:opacity-50"
            >
              🔄 Explain more simply
            </button>
            <button
              onClick={() => handleSendMessage('Can you give me another practical example from daily life?')}
              disabled={loading}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-md hover:bg-stone-100 text-slate-700 shrink-0 disabled:opacity-50"
            >
              🌱 Give me an example
            </button>
            <button
              onClick={() => handleSendMessage('Can you give me a step-by-step calculation?')}
              disabled={loading}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-md hover:bg-stone-100 text-slate-700 shrink-0 disabled:opacity-50"
            >
              🔢 Step-by-step math
            </button>
          </div>

          {error && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about this topic in English, Hindi, Odia, or Bengali..."
              disabled={loading}
              className="flex-1 px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-40 shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
