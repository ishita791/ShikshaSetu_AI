// LearnReach AI - Regional Language Learning & Academic Translation
// Supports English, Hindi, Odia, and Bengali with educational simplification & glossary

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TranslationRecord } from '../types';
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  FileText
} from 'lucide-react';

export const TranslatePage: React.FC = () => {
  const { user } = useAuth();

  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');

  const [translatedText, setTranslatedText] = useState('');
  const [simplifiedExplanation, setSimplifiedExplanation] = useState('');
  const [vocabulary, setVocabulary] = useState<{ original: string; translated: string; definition: string }[]>([]);
  
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [simplifying, setSimplifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTexts = [
    {
      title: 'Photosynthesis Formula',
      text: 'During photosynthesis, chlorophyll absorbs solar radiation. Carbon dioxide from the atmosphere and water from roots synthesize glucose and release oxygen.'
    },
    {
      title: 'Fractions in Agriculture',
      text: 'When a field is divided into equal portions, each tenant receives a fractional share represented by a numerator over the total denominator.'
    },
    {
      title: 'Water Cycle Percolation',
      text: 'Precipitation infiltrates into groundwater aquifers through porous soil layers, sustaining community wells through dry summer months.'
    }
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const records = await api.getTranslationHistory();
        setHistory(records);
      } catch (err) {
        console.warn('Failed to load translation history:', err);
      }
    }
    loadHistory();
  }, []);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await api.translate({
        text: sourceText,
        sourceLang,
        targetLang,
      });

      setTranslatedText(res.translatedText);
      setSimplifiedExplanation(res.simplifiedExplanation);
      setVocabulary(res.keyVocabulary || []);

      const updatedHistory = await api.getTranslationHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      setError(err.message || 'Translation failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    if (!sourceText.trim()) return;
    setError(null);
    setSimplifying(true);

    try {
      const res = await api.simplify({
        text: sourceText,
        language: targetLang,
      });
      setSimplifiedExplanation(res.simplifiedText + '\n\nEveryday Analogy: ' + res.analog);
    } catch (err: any) {
      setError('Simplification failed. Please try again.');
    } finally {
      setSimplifying(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setSimplifiedExplanation('');
    setVocabulary([]);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-teal-800 text-xs font-semibold">
          <Languages className="w-4 h-4 text-teal-600" />
          <span>Regional Language Translation & Concept Simplification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Learn in Your Regional Language
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Access global STEM concepts in Hindi, Odia, Bengali, and English. Our AI pairs accurate translations with simplified explanations and bilingual terminology glossaries.
        </p>
      </div>

      {/* Language Pickers & Action Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Languages Selection Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="text-xs py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-800"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="bn">Bengali (বাংলা)</option>
              </select>
            </div>

            <button
              onClick={handleSwapLanguages}
              className="mt-4 p-2 rounded-lg hover:bg-stone-100 text-slate-500 hover:text-slate-800 transition-colors border border-stone-200"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="text-xs py-1.5 px-3 bg-teal-50/70 border border-teal-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-teal-900"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="bn">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleSimplify}
              disabled={simplifying || !sourceText.trim()}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-teal-200 bg-teal-50/60 text-teal-800 hover:bg-teal-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{simplifying ? 'Simplifying...' : 'Simplify Explanation'}</span>
            </button>
            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="px-5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-xs flex items-center gap-1.5"
            >
              <span>{loading ? 'Translating...' : 'Translate'}</span>
            </button>
          </div>
        </div>

        {/* Sample Prompts strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Try educational sample:</span>
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSourceText(sample.text);
                setSourceLang('en');
              }}
              className="px-2.5 py-1 bg-stone-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-md border border-stone-200 transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Side-by-Side Original & Translated Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Source Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Original Text ({sourceLang.toUpperCase()})</span>
              <span>{sourceText.length} characters</span>
            </div>
            <textarea
              rows={8}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste textbook paragraph, homework question, or scientific definition here..."
              className="w-full p-4 text-xs sm:text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
            />
          </div>

          {/* Translated Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Translated Educational Text ({targetLang.toUpperCase()})</span>
              {translatedText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="w-full min-h-[192px] p-4 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="text-slate-400 italic">Translating into regional language...</div>
              ) : translatedText ? (
                translatedText
              ) : (
                <div className="text-slate-400 italic">Translated output will appear here.</div>
              )}
            </div>
          </div>

        </div>

        {/* Simplified Explanation & Glossary Cards */}
        {(simplifiedExplanation || vocabulary.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
            
            {/* Simplified version */}
            {simplifiedExplanation && (
              <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Simplified Concept Breakdown</span>
                </div>
                <p className="text-teal-950 leading-relaxed whitespace-pre-line">
                  {simplifiedExplanation}
                </p>
              </div>
            )}

            {/* Vocabulary Glossary */}
            {vocabulary.length > 0 && (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>Key Academic Vocabulary</span>
                </div>
                <div className="space-y-2">
                  {vocabulary.map((v, idx) => (
                    <div key={idx} className="pb-1.5 border-b border-stone-200/60 last:border-0">
                      <div className="font-medium text-slate-800">
                        {v.original} → <span className="text-teal-700">{v.translated}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{v.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Academic Verification Advisory */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p>
            <strong>Teacher Advisory:</strong> While LearnReach AI strives for academic precision across Indian regional dialects, students should verify important school examination terms with their certified teacher.
          </p>
        </div>

      </div>

      {/* Translation History Section */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Recent Translation History</span>
          </div>
          <span className="text-xs text-slate-400">{history.length} records saved</span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No previous translations saved yet.
          </p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-stone-50/70 border border-stone-200/80 rounded-xl text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-teal-800">
                    {rec.sourceLanguage.toUpperCase()} → {rec.targetLanguage.toUpperCase()}
                  </span>
                  <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-slate-600 line-clamp-1 italic">
                  "{rec.originalText}"
                </div>
                <div className="text-slate-800 font-medium line-clamp-2">
                  {rec.translatedText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
