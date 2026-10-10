// LearnReach AI - Global Footer Component
// Sustainable Development Goal 4: Quality Education for Every Student

import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, BookOpen, Globe2, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/60 text-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                LearnReach <span className="text-teal-700">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Advancing UN Sustainable Development Goal 4 by bringing adaptive, multilingual, and personalized learning to students in rural and underserved areas.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-800 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-teal-600" />
              <span>English · हिन्दी · ଓଡ଼ିଆ · বাংলা</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Learning Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/tutor" className="hover:text-teal-700 transition-colors">
                  AI Personal Tutor
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-teal-700 transition-colors">
                  Smart Practice Quizzes
                </Link>
              </li>
              <li>
                <Link to="/translate" className="hover:text-teal-700 transition-colors">
                  Regional Translation & Glossary
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-teal-700 transition-colors">
                  Learning Analytics & Gap Detection
                </Link>
              </li>
            </ul>
          </div>

          {/* SDG 4 Mission */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              SDG 4 Objectives
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <span className="text-slate-700 font-medium">Target 4.1:</span> Free, equitable primary & secondary education
              </li>
              <li>
                <span className="text-slate-700 font-medium">Target 4.5:</span> Eliminate gender & regional disparities
              </li>
              <li>
                <span className="text-slate-700 font-medium">Target 4.7:</span> Sustainable lifestyle & cultural diversity
              </li>
              <li>
                <span className="text-slate-700 font-medium">Adaptive AI:</span> Bridging teacher-student ratios in remote clusters
              </li>
            </ul>
          </div>

          {/* Academic Transparency & Reliability */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Academic Advisory
            </h4>
            <div className="p-3 bg-white/70 border border-stone-200 rounded-lg text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Pedagogical Standard</span>
              </div>
              <p>
                LearnReach AI encourages conceptual mastery rather than rote answers. Always verify complex examination translations with your certified school teacher.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} LearnReach AI – Personalized Learning for Every Student. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Rural Education Initiative</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">UN SDG 4 Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
