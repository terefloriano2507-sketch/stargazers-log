import React from 'react';
import { Sun, Moon, Type, Award, BookOpen, LineChart, FileText } from 'lucide-react';

export type ActiveTab = 'teoria' | 'grafica' | 'analitica';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  fontScale: FontSizeScale;
  onChangeFontScale: (scale: FontSizeScale) => void;
  onOpenScoreModal: () => void;
  totalAnswered: number;
  totalExercises: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  fontScale,
  onChangeFontScale,
  onOpenScoreModal,
  totalAnswered,
  totalExercises,
}) => {
  const fontSizes: { id: FontSizeScale; label: string; tooltip: string }[] = [
    { id: 'sm', label: 'A-', tooltip: 'Tamaño de fuente compacto (14px)' },
    { id: 'md', label: 'A', tooltip: 'Tamaño estándar (16px)' },
    { id: 'lg', label: 'A+', tooltip: 'Tamaño grande (18px)' },
    { id: 'xl', label: 'A++', tooltip: 'Tamaño muy grande (20px)' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onTabChange('teoria')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-500 transition-colors">
              lim
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Cálculo Diferencial <span className="font-normal text-slate-500 dark:text-slate-400 hidden md:inline">· Continuidad</span>
            </span>
          </button>

          {/* Zone 2: 3 clean navigation links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('teoria')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'teoria'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">1. Teoría y Conceptos</span>
              <span className="sm:hidden">Teoría</span>
            </button>

            <button
              onClick={() => onTabChange('grafica')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'grafica'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LineChart className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">2. Práctica Gráfica</span>
              <span className="sm:hidden">Gráfica</span>
            </button>

            <button
              onClick={() => onTabChange('analitica')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'analitica'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">3. Práctica Analítica</span>
              <span className="sm:hidden">Analítica</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Font Size, Dark Mode, Score Evaluation) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Font scale segmented control */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {fontSizes.map(f => (
                <button
                  key={f.id}
                  onClick={() => onChangeFontScale(f.id)}
                  title={f.tooltip}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                    fontScale === f.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Mobile Font Size Toggle */}
            <button
              onClick={() => {
                const order: FontSizeScale[] = ['sm', 'md', 'lg', 'xl'];
                const next = order[(order.indexOf(fontScale) + 1) % order.length];
                onChangeFontScale(next);
              }}
              title="Cambiar tamaño de texto"
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Ajustar tamaño de fuente"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Alternar modo día y noche"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Score Evaluation Trigger */}
            <button
              onClick={onOpenScoreModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>Evaluar Puntaje</span>
              <span className="hidden sm:inline bg-indigo-800/70 text-indigo-100 text-xs px-1.5 py-0.2 rounded-full tabular-nums">
                {totalAnswered}/{totalExercises}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
