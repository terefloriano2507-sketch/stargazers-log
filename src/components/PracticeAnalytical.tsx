import React, { useState } from 'react';
import { AnalyticalExercise, AnalyticalAnswer, DiscontinuityType } from '../types/calculus';
import { CalculusGraph } from './CalculusGraph';
import { MathView } from './MathView';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, Sparkles, BookOpen, Eye, HelpCircle } from 'lucide-react';

interface PracticeAnalyticalProps {
  exercises: AnalyticalExercise[];
  userAnswers: Record<number, AnalyticalAnswer>;
  onAnswerChange: (exerciseId: number, answer: Partial<AnalyticalAnswer>) => void;
  isDarkMode?: boolean;
  onRegenerateExercises: () => void;
  onOpenScoreModal: () => void;
  verifiedList: number[];
  onVerifyExercise: (exerciseId: number) => void;
  onVerifyAll: () => void;
}

export const PracticeAnalytical: React.FC<PracticeAnalyticalProps> = ({
  exercises,
  userAnswers,
  onAnswerChange,
  isDarkMode = false,
  onRegenerateExercises,
  onOpenScoreModal,
  verifiedList,
  onVerifyExercise,
  onVerifyAll,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const safeIndex = exercises.length > 0 ? Math.min(Math.max(0, currentSlideIndex), exercises.length - 1) : 0;
  const currentExercise = exercises[safeIndex] || exercises[0];
  const currentAnswer: AnalyticalAnswer = (currentExercise ? userAnswers[currentExercise.id] : null) || {
    leftLimit: '',
    rightLimit: '',
    generalLimit: '',
    fOfA: '',
    isEqual: null,
    isContinuous: null,
    discontinuityType: '',
  };
  const isCurrentVerified = Boolean(currentExercise && verifiedList.includes(currentExercise.id));

  // Helper to restart with fresh problems
  const handleRestartWithNewProblems = () => {
    onRegenerateExercises();
    setCurrentSlideIndex(0);
  };

  // Normalize string comparisons (trim, lower case, unify signs)
  const norm = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '')
      .replace(/\\infty/g, 'inf')
      .replace(/\+inf/g, 'inf')
      .replace(/noexiste/g, 'dne')
      .replace(/nodefinida/g, 'nd');

  const checkField = (userVal: string, exactVal: string) => {
    if (!userVal) return false;
    const nUser = norm(userVal);
    const nExact = norm(exactVal);
    if (nUser === nExact) return true;
    if (
      (nExact === 'inf' || nExact === '+inf') &&
      (nUser === 'inf' || nUser === '+inf' || nUser === 'oo' || nUser === '+oo')
    )
      return true;
    if (nExact === '-inf' && (nUser === '-inf' || nUser === '-oo')) return true;
    if (
      (nExact === 'dne' || nExact === 'noexiste') &&
      (nUser === 'dne' || nUser === 'noexiste' || nUser === 'no_existe')
    )
      return true;
    if (
      (nExact === 'nd' || nExact === 'nodefinida') &&
      (nUser === 'nd' || nUser === 'nodefinida' || nUser === 'no_definida')
    )
      return true;
    return false;
  };

  const isLeftOk = checkField(currentAnswer.leftLimit, currentExercise?.exactLeftLimit || '');
  const isRightOk = checkField(currentAnswer.rightLimit, currentExercise?.exactRightLimit || '');
  const isGenOk = checkField(currentAnswer.generalLimit, currentExercise?.exactGeneralLimit || '');
  const isFOk = checkField(currentAnswer.fOfA, currentExercise?.exactFOfA || '');
  const isEqualOk = currentAnswer.isEqual === currentExercise?.isEqualLimitAndF;
  const isContOk = currentAnswer.isContinuous === currentExercise?.isContinuous;
  const isTypeOk = currentExercise?.isContinuous
    ? true
    : currentAnswer.discontinuityType === currentExercise?.discontinuityType;

  const isOverallExerciseOk =
    isLeftOk && isRightOk && isGenOk && isFOk && isEqualOk && isContOk && isTypeOk;

  const allVerified = exercises.length > 0 && exercises.every(e => verifiedList.includes(e.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Módulo 3 · Práctica Analítica Rigurosa
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Análisis Analítico de Funciones por Tramos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calcula algebraicamente los límites laterales, el valor de la función y diagnostica la continuidad formal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleRestartWithNewProblems}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            title="Seleccionar 6 ejercicios analíticos distintos del pool de 20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Nuevos 6 Ejercicios</span>
          </button>

          <button
            onClick={onVerifyAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verificar Todo</span>
          </button>
        </div>
      </div>

      {/* Pagination pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {exercises.map((ex, idx) => {
            const isVerified = verifiedList.includes(ex.id);
            const ans = userAnswers[ex.id];
            const isAnswered = ans && (ans.leftLimit || ans.isContinuous !== null);

            return (
              <button
                key={ex.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentSlideIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isVerified
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-indigo-300 dark:border-indigo-700'
                    : isAnswered
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Tramos {idx + 1}</span>
                {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
          Ejercicio {currentSlideIndex + 1} de {exercises.length}
        </span>
      </div>

      {/* Main Card */}
      {currentExercise && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Exercise Definition Block */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Problema {currentSlideIndex + 1} · {currentExercise.title}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                Punto crítico: x = {currentExercise.pointToEvaluate}
              </span>
            </div>

            {/* Piecewise LaTeX Render */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 text-center overflow-x-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                Función definida a trozos:
              </span>
              <MathView math={currentExercise.piecewiseLaTeX} block className="text-base sm:text-lg" />
            </div>
          </div>

          {/* Form: 5 Formal Steps to Analyze */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Column 1: Limits computation */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  A
                </span>
                <span>Límites Laterales y General</span>
              </h3>

              {/* 1. Límite Izquierdo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>1. Límite lateral izquierdo</span>
                    <MathView math={`\\lim_{x \\to ${currentExercise.pointToEvaluate}^-} f(x)`} />:
                  </label>
                  {isCurrentVerified && (
                    isLeftOk ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Valor esperado: {currentExercise.exactLeftLimit}
                      </span>
                    )
                  )}
                </div>
                <input
                  type="text"
                  placeholder='Ej: "3", "-2", "+inf", "-inf", "No existe"'
                  value={currentAnswer.leftLimit}
                  onChange={e => onAnswerChange(currentExercise.id, { leftLimit: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    isCurrentVerified
                      ? isLeftOk
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              {/* 2. Límite Derecho */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>2. Límite lateral derecho</span>
                    <MathView math={`\\lim_{x \\to ${currentExercise.pointToEvaluate}^+} f(x)`} />:
                  </label>
                  {isCurrentVerified && (
                    isRightOk ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Valor esperado: {currentExercise.exactRightLimit}
                      </span>
                    )
                  )}
                </div>
                <input
                  type="text"
                  placeholder='Ej: "3", "-2", "+inf", "-inf", "No existe"'
                  value={currentAnswer.rightLimit}
                  onChange={e => onAnswerChange(currentExercise.id, { rightLimit: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    isCurrentVerified
                      ? isRightOk
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              {/* 3. Límite General */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>3. Valor del límite bilateral</span>
                    <MathView math={`\\lim_{x \\to ${currentExercise.pointToEvaluate}} f(x)`} />:
                  </label>
                  {isCurrentVerified && (
                    isGenOk ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Valor esperado: {currentExercise.exactGeneralLimit}
                      </span>
                    )
                  )}
                </div>
                <input
                  type="text"
                  placeholder='Ej: "3", "No existe", "+inf"'
                  value={currentAnswer.generalLimit}
                  onChange={e => onAnswerChange(currentExercise.id, { generalLimit: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    isCurrentVerified
                      ? isGenOk
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Column 2: f(a) & Continuity Diagnosis */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  B
                </span>
                <span>Evaluación Puntual y Criterio de Igualdad</span>
              </h3>

              {/* 4. Valor de f(a) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>4. Valor puntual de la función</span>
                    <MathView math={`f(${currentExercise.pointToEvaluate})`} />:
                  </label>
                  {isCurrentVerified && (
                    isFOk ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Valor esperado: {currentExercise.exactFOfA}
                      </span>
                    )
                  )}
                </div>
                <input
                  type="text"
                  placeholder='Ej: "7", "0", "No definida"'
                  value={currentAnswer.fOfA}
                  onChange={e => onAnswerChange(currentExercise.id, { fOfA: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    isCurrentVerified
                      ? isFOk
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              {/* 5. ¿Coincide el límite con f(a)? */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    5. ¿Se verifica que <MathView math={`\\lim_{x \\to ${currentExercise.pointToEvaluate}} f(x) = f(${currentExercise.pointToEvaluate})`} />?
                  </label>
                  {isCurrentVerified && (
                    isEqualOk ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrecto
                      </span>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onAnswerChange(currentExercise.id, {
                        isEqual: true,
                        isContinuous: true,
                        discontinuityType: '',
                      })
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      currentAnswer.isEqual === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Sí, coinciden (Continua)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onAnswerChange(currentExercise.id, {
                        isEqual: false,
                        isContinuous: false,
                      })
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      currentAnswer.isEqual === false
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    No coinciden / No existe
                  </button>
                </div>
              </div>

              {/* Si no es continua, tipo de discontinuidad */}
              {currentAnswer.isEqual === false && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      6. Determinar analíticamente el tipo de discontinuidad:
                    </label>
                    {isCurrentVerified && (
                      isTypeOk ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                        </span>
                      ) : (
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrecto
                        </span>
                      )
                    )}
                  </div>
                  <select
                    value={currentAnswer.discontinuityType}
                    onChange={e =>
                      onAnswerChange(currentExercise.id, {
                        discontinuityType: e.target.value as DiscontinuityType,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">-- Elige la clasificación analítica --</option>
                    <option value="evitable">Discontinuidad Evitable o Removible</option>
                    <option value="salto_finito">Discontinuidad Inevitable de Salto Finito</option>
                    <option value="salto_infinito">Discontinuidad Inevitable de Salto Infinito</option>
                    <option value="segunda_especie">Discontinuidad de Segunda Especie / Otras</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onVerifyExercise(currentExercise.id)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verificar Respuesta</span>
              </button>

              {currentSlideIndex < exercises.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <span>Siguiente ejercicio ({currentSlideIndex + 2}/6)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenScoreModal}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Calificación Total</span>
                </button>
              )}
            </div>

            {/* Quick status message */}
            {isCurrentVerified && (
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                  isOverallExerciseOk
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {isOverallExerciseOk
                  ? '¡Excelente! Respuesta analítica completamente correcta.'
                  : 'Revisa el desarrollo paso a paso y la gráfica a continuación.'}
              </span>
            )}
          </div>

          {/* Gráfica de la función por trozos solicitada: Aparece al presionar el botón de verificar respuesta */}
          {isCurrentVerified && currentExercise.graphSpec && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Gráfica de la Función por Tramos
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Visualización del comportamiento en el punto crítico x = {currentExercise.pointToEvaluate}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                  {currentExercise.discontinuityType === 'continua'
                    ? 'Empalme continuo'
                    : `Discontinuidad: ${currentExercise.discontinuityType.replace('_', ' ')}`}
                </span>
              </div>

              {/* SVG Graphic Renderer */}
              <div className="w-full flex justify-center bg-white dark:bg-slate-900/70 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <CalculusGraph
                  spec={currentExercise.graphSpec}
                  pointToEvaluate={currentExercise.pointToEvaluate}
                  isDarkMode={isDarkMode}
                  width={540}
                  height={320}
                />
              </div>
            </div>
          )}

          {/* Step-by-Step Educational Solution & Justification */}
          {isCurrentVerified && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Desarrollo Analítico Paso a Paso:
                </h4>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-mono">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Paso 1 (Límite Izquierdo):</span>{' '}
                  <MathView math={currentExercise.stepByStepSolution.leftStep} />
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Paso 2 (Límite Derecho):</span>{' '}
                  <MathView math={currentExercise.stepByStepSolution.rightStep} />
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-purple-600 dark:text-purple-400">Paso 3 (Límite Bilateral):</span>{' '}
                  <MathView math={currentExercise.stepByStepSolution.generalLimitStep} />
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-amber-600 dark:text-amber-400">Paso 4 (Evaluación puntual f(a)):</span>{' '}
                  <MathView math={currentExercise.stepByStepSolution.fOfAStep} />
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-rose-600 dark:text-rose-400">Paso 5 (Comparación y Conclusión):</span>{' '}
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium">
                    {currentExercise.stepByStepSolution.conclusion}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Opción de Volver a empezar y presentar problemas nuevos al terminar los 6 problemas */}
          {(currentSlideIndex === exercises.length - 1 || allVerified) && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-5 mt-6 shadow-xs">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fin de la ronda de 6 problemas</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  ¿Deseas practicar con 6 problemas analíticos nuevos?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Se seleccionará un nuevo conjunto aleatorio del banco de 20 funciones por tramos con diferentes tipos de discontinuidades.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRestartWithNewProblems}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Volver a empezar y presentar problemas nuevos</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenScoreModal}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Ver Calificación Total</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
