import React, { useState } from 'react';
import { GraphicalExercise, GraphicalAnswer, DiscontinuityType } from '../types/calculus';
import { CalculusGraph } from './CalculusGraph';
import { MathView } from './MathView';
import { Play, CheckCircle2, XCircle, RefreshCw, HelpCircle, ArrowRight, Eye, Layers } from 'lucide-react';

interface PracticeGraphicalProps {
  exercises: GraphicalExercise[];
  userAnswers: Record<number, GraphicalAnswer>;
  onAnswerChange: (exerciseId: number, answer: Partial<GraphicalAnswer>) => void;
  isDarkMode: boolean;
  onRegenerateExercises: () => void;
  onGoToNextSection: () => void;
  verifiedList: number[];
  onVerifyExercise: (exerciseId: number) => void;
  onVerifyAll: () => void;
}

export const PracticeGraphical: React.FC<PracticeGraphicalProps> = ({
  exercises,
  userAnswers,
  onAnswerChange,
  isDarkMode,
  onRegenerateExercises,
  onGoToNextSection,
  verifiedList,
  onVerifyExercise,
  onVerifyAll,
}) => {
  // Tracking which limit animation is currently running per exercise: { [exerciseId]: 'left' | 'right' | 'both' | null }
  const [animatingLimit, setAnimatingLimit] = useState<Record<number, 'left' | 'right' | 'both' | null>>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handleRestart = () => {
    onRegenerateExercises();
    setCurrentSlideIndex(0);
  };

  const triggerAnimation = (exerciseId: number, side: 'left' | 'right' | 'both') => {
    setAnimatingLimit(prev => ({ ...prev, [exerciseId]: null }));
    setTimeout(() => {
      setAnimatingLimit(prev => ({ ...prev, [exerciseId]: side }));
    }, 30);
  };

  const safeIndex = exercises.length > 0 ? Math.min(Math.max(0, currentSlideIndex), exercises.length - 1) : 0;
  const currentExercise = exercises[safeIndex] || exercises[0];
  const currentAnswer = (currentExercise ? userAnswers[currentExercise.id] : null) || { isContinuous: null, discontinuityType: '' };
  const isCurrentVerified = Boolean(currentExercise && verifiedList.includes(currentExercise.id));

  // Evaluate correctness of current answer
  const isContinuousCorrect = Boolean(
    currentExercise &&
    currentAnswer.isContinuous !== null &&
    currentAnswer.isContinuous === currentExercise.isContinuous
  );
  
  const isTypeCorrect = Boolean(
    currentExercise &&
    (currentExercise.isContinuous
      ? true
      : currentAnswer.discontinuityType === currentExercise.discontinuityType)
  );

  const isFullyCorrect = isContinuousCorrect && isTypeCorrect;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Módulo 2 · Práctica Interactiva
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Análisis Gráfico e Interactivo de Continuidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ronda actual: 6 ejercicios seleccionados al azar de un banco de 20 problemas gráficos.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            title="Seleccionar 6 ejercicios diferentes del pool"
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

      {/* Exercise Pagination Pills / Tracker */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {exercises.map((ex, idx) => {
            const ans = userAnswers[ex.id];
            const isVerified = verifiedList.includes(ex.id);
            const isAnswered = Boolean(ans && ans.isContinuous !== null);
            const isOk = Boolean(
              isVerified &&
              ans &&
              ans.isContinuous !== null &&
              ans.isContinuous === ex.isContinuous &&
              (ex.isContinuous || ans.discontinuityType === ex.discontinuityType)
            );

            return (
              <button
                key={ex.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentSlideIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isVerified
                    ? isOk
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                    : isAnswered
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>Ejercicio {idx + 1}</span>
                {isVerified && (
                  isOk ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  )
                )}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-slate-500 shrink-0">
          {currentSlideIndex + 1} de {exercises.length}
        </span>
      </div>

      {/* Main Exercise Card: Split Layout */}
      {currentExercise && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header of Exercise */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ejercicio #{currentSlideIndex + 1} (ID: {currentExercise.id})
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentExercise.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">Expresión:</span>
              <MathView math={currentExercise.mathExpression} className="text-sm font-semibold" />
            </div>
          </div>

          {/* Interactive Split View: Graph & Question Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: SVG Graph & Limit Animation Triggers */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Evaluar continuidad en el punto x = {currentExercise.pointToEvaluate}
                </span>
                <span className="text-xs text-slate-400">Pasa el cursor para ver coordenadas</span>
              </div>

              {/* Calculus Graph */}
              <div className="w-full">
                <CalculusGraph
                  spec={currentExercise.graphSpec}
                  pointToEvaluate={currentExercise.pointToEvaluate}
                  highlightLeftLimit={animatingLimit[currentExercise.id] === 'left'}
                  highlightRightLimit={animatingLimit[currentExercise.id] === 'right'}
                  highlightBothLimits={animatingLimit[currentExercise.id] === 'both'}
                  isDarkMode={isDarkMode}
                  width={520}
                  height={320}
                />
              </div>

              {/* Limit Animation Triggers Required by Brief */}
              <div className="w-full mt-4 flex flex-col items-center gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerAnimation(currentExercise.id, 'left')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <Play className="w-3.5 h-3.5" />
                    <span>Límite Lateral Izquierdo (x → {currentExercise.pointToEvaluate}⁻)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerAnimation(currentExercise.id, 'right')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <Play className="w-3.5 h-3.5" />
                    <span>Límite Lateral Derecho (x → {currentExercise.pointToEvaluate}⁺)</span>
                  </button>

                  {animatingLimit[currentExercise.id] && (
                    <button
                      type="button"
                      onClick={() => setAnimatingLimit(prev => ({ ...prev, [currentExercise.id]: null }))}
                      className="p-2 rounded-lg text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Pausar animación"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Botón Ambos Límites debajo de Límite izquierdo y derecho */}
                <button
                  type="button"
                  onClick={() => triggerAnimation(currentExercise.id, 'both')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ambos Límites Simultáneos (animar por los dos lados)</span>
                </button>
              </div>
            </div>

            {/* Right 5 cols: Decision Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Paso 1: Diagnóstico de Continuidad
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  ¿Es la función <MathView math="f(x)" /> continua en el punto <MathView math={`x = ${currentExercise.pointToEvaluate}`} />?
                </p>

                {/* Yes / No buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAnswerChange(currentExercise.id, {
                        isContinuous: true,
                        discontinuityType: '', // reset if continuous
                      });
                    }}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                      currentAnswer.isContinuous === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sí, es continua</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onAnswerChange(currentExercise.id, {
                        isContinuous: false,
                      });
                    }}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                      currentAnswer.isContinuous === false
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>No, es discontinua</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Enabled dropdown if student determines it's not continuous */}
              <div
                className={`space-y-3 transition-all ${
                  currentAnswer.isContinuous === false
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-40 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Paso 2: Tipo de Discontinuidad
                  </span>
                  {currentAnswer.isContinuous !== false && (
                    <span className="text-2xs text-slate-400 italic">
                      (Se activa al marcar "No, es discontinua")
                    </span>
                  )}
                </div>

                <label className="block text-xs text-slate-600 dark:text-slate-300">
                  Selecciona la clasificación precisa de la discontinuidad observada:
                </label>

                <select
                  disabled={currentAnswer.isContinuous !== false}
                  value={currentAnswer.discontinuityType}
                  onChange={e =>
                    onAnswerChange(currentExercise.id, {
                      discontinuityType: e.target.value as DiscontinuityType,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">-- Elige el tipo exacto --</option>
                  <option value="evitable">Discontinuidad Evitable o Removible (Hueco)</option>
                  <option value="salto_finito">Discontinuidad Inevitable de Salto Finito</option>
                  <option value="salto_infinito">Discontinuidad Inevitable de Salto Infinito (Asintótica)</option>
                  <option value="segunda_especie">Discontinuidad de Segunda Especie / Otras</option>
                </select>
              </div>

              {/* Action Buttons for this card */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onVerifyExercise(currentExercise.id)}
                  disabled={currentAnswer.isContinuous === null || (currentAnswer.isContinuous === false && !currentAnswer.discontinuityType)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    currentAnswer.isContinuous === null || (currentAnswer.isContinuous === false && !currentAnswer.discontinuityType)
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verificar esta respuesta</span>
                </button>

                {currentSlideIndex < exercises.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <span>Siguiente ejercicio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToNextSection}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Ir a Práctica Analítica</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Instant Step-by-Step Feedback Banner */}
              {isCurrentVerified && (
                <div
                  className={`p-4 rounded-xl border space-y-3 transition-all ${
                    isFullyCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isFullyCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {isFullyCorrect
                        ? '¡Excelente! Respuesta 100% correcta'
                        : 'Revisión didáctica de tu respuesta:'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 border-t border-slate-200/60 dark:border-slate-800 pt-2">
                    <p>
                      <strong>1. Evaluación de f({currentExercise.pointToEvaluate}):</strong>{' '}
                      {currentExercise.explanation.fOfAExplanation}
                    </p>
                    <p>
                      <strong>2. Comportamiento de los límites laterales:</strong>{' '}
                      {currentExercise.explanation.limitsExplanation}
                    </p>
                    <p>
                      <strong>3. Conclusión formal:</strong>{' '}
                      {currentExercise.explanation.conclusionExplanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner de fin de ronda de 6 ejercicios gráficos */}
          {currentSlideIndex === exercises.length - 1 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 dark:from-indigo-950/40 dark:via-blue-950/40 dark:to-emerald-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-5 mt-6 shadow-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  ¡Has completado los 6 ejercicios gráficos!
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  ¿Deseas volver a empezar con nuevos problemas o avanzar a la práctica analítica?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Puedes cargar 6 funciones gráficas nuevas del banco o pasar al análisis de funciones por tramos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Nuevos 6 Ejercicios Gráficos</span>
                </button>

                <button
                  type="button"
                  onClick={onGoToNextSection}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Ir a Práctica Analítica</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
