/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, ActiveTab, FontSizeScale } from './components/Navbar';
import { TheorySection } from './components/TheorySection';
import { PracticeGraphical } from './components/PracticeGraphical';
import { PracticeAnalytical } from './components/PracticeAnalytical';
import { ScoreModal } from './components/ScoreModal';
import { Footer } from './components/Footer';
import { GRAPHICAL_EXERCISES_POOL } from './data/graphicalExercisesPool';
import { ANALYTICAL_EXERCISES_POOL } from './data/analyticalExercisesPool';
import { GraphicalExercise, AnalyticalExercise, GraphicalAnswer, AnalyticalAnswer } from './types/calculus';
import { Award, CheckCheck, RefreshCw, Sparkles } from 'lucide-react';

// Helper to shuffle and pick N items
function pickRandom<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calculus_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Font scale state: 'sm' | 'md' | 'lg' | 'xl'
  const [fontScale, setFontScale] = useState<FontSizeScale>('md');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('teoria');

  // Score Modal Open state
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);

  // Pool of 6 randomly selected graphical exercises (from 20)
  const [graphicalExercises, setGraphicalExercises] = useState<GraphicalExercise[]>(() =>
    pickRandom(GRAPHICAL_EXERCISES_POOL, 6)
  );

  // Pool of 6 randomly selected analytical exercises (from 20)
  const [analyticalExercises, setAnalyticalExercises] = useState<AnalyticalExercise[]>(() =>
    pickRandom(ANALYTICAL_EXERCISES_POOL, 6)
  );

  // User answers
  const [graphicalAnswers, setGraphicalAnswers] = useState<Record<number, GraphicalAnswer>>({});
  const [analyticalAnswers, setAnalyticalAnswers] = useState<Record<number, AnalyticalAnswer>>({});

  // Verified exercises lists (for immediate feedback)
  const [verifiedGraphical, setVerifiedGraphical] = useState<number[]>([]);
  const [verifiedAnalytical, setVerifiedAnalytical] = useState<number[]>([]);

  // Effect to toggle dark class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('calculus_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('calculus_theme', 'light');
    }
  }, [isDarkMode]);

  // Effect to adjust root font size based on font scale
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes: Record<FontSizeScale, string> = {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    };
    root.style.fontSize = fontSizes[fontScale];
  }, [fontScale]);

  // Handlers for graphical answers
  const handleGraphicalAnswerChange = useCallback(
    (exerciseId: number, partialAnswer: Partial<GraphicalAnswer>) => {
      setGraphicalAnswers(prev => ({
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] || { isContinuous: null, discontinuityType: '' }),
          ...partialAnswer,
        },
      }));
    },
    []
  );

  // Handlers for analytical answers
  const handleAnalyticalAnswerChange = useCallback(
    (exerciseId: number, partialAnswer: Partial<AnalyticalAnswer>) => {
      setAnalyticalAnswers(prev => ({
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] || {
            leftLimit: '',
            rightLimit: '',
            generalLimit: '',
            fOfA: '',
            isEqual: null,
            isContinuous: null,
            discontinuityType: '',
          }),
          ...partialAnswer,
        },
      }));
    },
    []
  );

  // Verify single graphical exercise
  const handleVerifyGraphicalExercise = useCallback((exerciseId: number) => {
    setVerifiedGraphical(prev => (prev.includes(exerciseId) ? prev : [...prev, exerciseId]));
  }, []);

  // Verify all graphical exercises
  const handleVerifyAllGraphical = useCallback(() => {
    setVerifiedGraphical(graphicalExercises.map(e => e.id));
  }, [graphicalExercises]);

  // Verify single analytical exercise
  const handleVerifyAnalyticalExercise = useCallback((exerciseId: number) => {
    setVerifiedAnalytical(prev => (prev.includes(exerciseId) ? prev : [...prev, exerciseId]));
  }, []);

  // Verify all analytical exercises
  const handleVerifyAllAnalytical = useCallback(() => {
    setVerifiedAnalytical(analyticalExercises.map(e => e.id));
  }, [analyticalExercises]);

  // Global: Verify answers in BOTH sections (as explicitly required by prompt)
  const handleVerifyBothSections = useCallback(() => {
    setVerifiedGraphical(graphicalExercises.map(e => e.id));
    setVerifiedAnalytical(analyticalExercises.map(e => e.id));
  }, [graphicalExercises, analyticalExercises]);

  // Regenerate 6 fresh graphical exercises from pool of 20
  const handleRegenerateGraphical = useCallback(() => {
    const nextBatch = pickRandom(GRAPHICAL_EXERCISES_POOL, 6);
    setGraphicalExercises(nextBatch);
    setVerifiedGraphical([]);
  }, []);

  // Regenerate 6 fresh analytical exercises from pool of 20
  const handleRegenerateAnalytical = useCallback(() => {
    const nextBatch = pickRandom(ANALYTICAL_EXERCISES_POOL, 6);
    setAnalyticalExercises(nextBatch);
    setVerifiedAnalytical([]);
    setAnalyticalAnswers(prev => {
      const next = { ...prev };
      nextBatch.forEach(b => {
        delete next[b.id];
      });
      return next;
    });
  }, []);

  // Full restart: pick fresh 6 + 6 exercises and clear answers
  const handleRestartAll = useCallback(() => {
    setGraphicalExercises(pickRandom(GRAPHICAL_EXERCISES_POOL, 6));
    setAnalyticalExercises(pickRandom(ANALYTICAL_EXERCISES_POOL, 6));
    setGraphicalAnswers({});
    setAnalyticalAnswers({});
    setVerifiedGraphical([]);
    setVerifiedAnalytical([]);
  }, []);

  // Total answered calculation
  const totalGraphicalAnswered = Object.values(graphicalAnswers).filter(
    a => Boolean(a && a.isContinuous !== null)
  ).length;

  const totalAnalyticalAnswered = Object.values(analyticalAnswers).filter(
    a => Boolean(a && (a.leftLimit || a.isContinuous !== null))
  ).length;

  const totalAnswered = totalGraphicalAnswered + totalAnalyticalAnswered;
  const totalExercises = graphicalExercises.length + analyticalExercises.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Accessible Global Navbar adhering to 3-zone Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        onOpenScoreModal={() => setIsScoreModalOpen(true)}
        totalAnswered={totalAnswered}
        totalExercises={totalExercises}
      />

      {/* Global Quick Action Bar: "Verificar respuestas en ambas secciones" & Progress Bar */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
              Progreso Global:
            </span>
            <div className="w-36 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalAnswered / (totalExercises || 1)) * 100}%` }}
              />
            </div>
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {totalAnswered} / {totalExercises} contestados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyBothSections}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
              title="Recibe retroalimentación inmediata paso a paso en todos los ejercicios"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Verificar respuestas en ambas secciones</span>
            </button>

            <button
              onClick={() => setIsScoreModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ver Puntaje</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'teoria' && (
          <TheorySection
            isDarkMode={isDarkMode}
            onGoToPractice1={() => setActiveTab('grafica')}
            onGoToPractice2={() => setActiveTab('analitica')}
          />
        )}

        {activeTab === 'grafica' && (
          <PracticeGraphical
            exercises={graphicalExercises}
            userAnswers={graphicalAnswers}
            onAnswerChange={handleGraphicalAnswerChange}
            isDarkMode={isDarkMode}
            onRegenerateExercises={handleRegenerateGraphical}
            onGoToNextSection={() => setActiveTab('analitica')}
            verifiedList={verifiedGraphical}
            onVerifyExercise={handleVerifyGraphicalExercise}
            onVerifyAll={handleVerifyAllGraphical}
          />
        )}

        {activeTab === 'analitica' && (
          <PracticeAnalytical
            exercises={analyticalExercises}
            userAnswers={analyticalAnswers}
            onAnswerChange={handleAnalyticalAnswerChange}
            isDarkMode={isDarkMode}
            onRegenerateExercises={handleRegenerateAnalytical}
            onOpenScoreModal={() => setIsScoreModalOpen(true)}
            verifiedList={verifiedAnalytical}
            onVerifyExercise={handleVerifyAnalyticalExercise}
            onVerifyAll={handleVerifyAllAnalytical}
          />
        )}
      </main>

      {/* Footer with Mandatory Author Credit: Teresa Floriano */}
      <Footer />

      {/* Evaluation and Scoring Modal */}
      <ScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        graphicalExercises={graphicalExercises}
        graphicalAnswers={graphicalAnswers}
        analyticalExercises={analyticalExercises}
        analyticalAnswers={analyticalAnswers}
        onRestartAll={handleRestartAll}
      />
    </div>
  );
}
