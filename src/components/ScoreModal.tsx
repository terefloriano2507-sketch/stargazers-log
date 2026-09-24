import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GraphicalExercise, AnalyticalExercise, GraphicalAnswer, AnalyticalAnswer } from '../types/calculus';
import { X, Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { MathView } from './MathView';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  graphicalExercises: GraphicalExercise[];
  graphicalAnswers: Record<number, GraphicalAnswer>;
  analyticalExercises: AnalyticalExercise[];
  analyticalAnswers: Record<number, AnalyticalAnswer>;
  onRestartAll: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  graphicalExercises,
  graphicalAnswers,
  analyticalExercises,
  analyticalAnswers,
  onRestartAll,
}) => {
  // Normalize string comparisons
  const norm = (s: string) =>
    (s || '')
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
    if ((nExact === 'inf' || nExact === '+inf') && (nUser === 'inf' || nUser === '+inf' || nUser === 'oo' || nUser === '+oo')) return true;
    if (nExact === '-inf' && (nUser === '-inf' || nUser === '-oo')) return true;
    if ((nExact === 'dne' || nExact === 'noexiste') && (nUser === 'dne' || nUser === 'noexiste')) return true;
    if ((nExact === 'nd' || nExact === 'nodefinida') && (nUser === 'nd' || nUser === 'nodefinida')) return true;
    return false;
  };

  // Evaluate Graphical exercises (each has 1 point)
  let graphicalCorrect = 0;
  const graphicalDetails = (graphicalExercises || []).filter(Boolean).map(ex => {
    const ans = (ex && graphicalAnswers[ex.id]) || { isContinuous: null, discontinuityType: '' };
    const isContCorrect = ans.isContinuous !== null && ans.isContinuous === ex?.isContinuous;
    const isTypeCorrect = ex?.isContinuous ? true : ans.discontinuityType === ex?.discontinuityType;
    const isOk = isContCorrect && isTypeCorrect;
    if (isOk) graphicalCorrect++;
    return {
      exercise: ex,
      userAns: ans,
      isOk,
    };
  });

  // Evaluate Analytical exercises (each has 1 point)
  let analyticalCorrect = 0;
  const analyticalDetails = (analyticalExercises || []).filter(Boolean).map(ex => {
    const ans = (ex && analyticalAnswers[ex.id]) || {
      leftLimit: '',
      rightLimit: '',
      generalLimit: '',
      fOfA: '',
      isEqual: null,
      isContinuous: null,
      discontinuityType: '',
    };
    const isLeftOk = checkField(ans.leftLimit, ex?.exactLeftLimit || '');
    const isRightOk = checkField(ans.rightLimit, ex?.exactRightLimit || '');
    const isGenOk = checkField(ans.generalLimit, ex?.exactGeneralLimit || '');
    const isFOk = checkField(ans.fOfA, ex?.exactFOfA || '');
    const isEqualOk = ans.isEqual === ex?.isEqualLimitAndF;
    const isContOk = ans.isContinuous !== null && ans.isContinuous === ex?.isContinuous;
    const isTypeOk = ex?.isContinuous ? true : ans.discontinuityType === ex?.discontinuityType;

    const isOk = isLeftOk && isRightOk && isGenOk && isFOk && isEqualOk && isContOk && isTypeOk;
    if (isOk) analyticalCorrect++;
    return {
      exercise: ex,
      userAns: ans,
      isOk,
      isLeftOk,
      isRightOk,
      isGenOk,
      isFOk,
    };
  });

  const totalPossible = graphicalExercises.length + analyticalExercises.length;
  const totalCorrect = graphicalCorrect + analyticalCorrect;
  const percentage = Math.round((totalCorrect / (totalPossible || 1)) * 100);

  // Trigger celebration on good scores when modal opens
  useEffect(() => {
    if (isOpen && percentage >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, percentage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Evaluación General del Desempeño
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Puntaje obtenido en los 12 ejercicios activos (6 Gráficos + 6 Analíticos)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Score Banner */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Calificación Final
              </span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {percentage}%
                </span>
                <span className="text-slate-500 font-mono text-sm">
                  ({totalCorrect} / {totalPossible} ejercicios)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {percentage >= 90
                  ? '¡Dominio Magistral! Comprendes con solidez teórica y gráfica todos los criterios.'
                  : percentage >= 70
                  ? '¡Buen trabajo! Tienes claros los conceptos principales; repasa los detalles analíticos.'
                  : 'Sigue practicando. Te recomendamos consultar la sección de Teoría y Gráficas explicativas.'}
              </p>
            </div>

            {/* Sub-scores by module */}
            <div className="flex gap-4 shrink-0">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center min-w-[110px]">
                <span className="text-2xs text-slate-400 uppercase font-semibold block">
                  Práctica 1 (Gráfica)
                </span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {graphicalCorrect} / {graphicalExercises.length}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center min-w-[110px]">
                <span className="text-2xs text-slate-400 uppercase font-semibold block">
                  Práctica 2 (Analítica)
                </span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {analyticalCorrect} / {analyticalExercises.length}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Section: Graphical */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Desglose: Práctica 1 (Análisis Gráfico)</span>
            </h3>

            <div className="space-y-2">
              {graphicalDetails.map((item, idx) => (
                <div
                  key={item.exercise.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    item.isOk
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.isOk ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        #{idx + 1}: {item.exercise.title}
                      </span>
                      <span className="text-slate-500 block">
                        Punto x = {item.exercise.pointToEvaluate} · Resultado correcto:{' '}
                        {item.exercise.isContinuous
                          ? 'Continua'
                          : `Discontinua (${item.exercise.discontinuityType.replace('_', ' ')})`}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-semibold shrink-0 ${
                      item.isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.isOk ? '+1 acierto' : '0 / 1'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Section: Analytical */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Desglose: Práctica 2 (Análisis Analítico por Tramos)</span>
            </h3>

            <div className="space-y-2">
              {analyticalDetails.map((item, idx) => (
                <div
                  key={item.exercise.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    item.isOk
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.isOk ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        #{idx + 1}: {item.exercise.title}
                      </span>
                      <span className="text-slate-500 block">
                        x = {item.exercise.pointToEvaluate} · Límites esperados: (Izq: {item.exercise.exactLeftLimit}, Der: {item.exercise.exactRightLimit}, General: {item.exercise.exactGeneralLimit}, f(a): {item.exercise.exactFOfA})
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-semibold shrink-0 ${
                      item.isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.isOk ? '+1 acierto' : '0 / 1'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onRestartAll();
              onClose();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generar nueva ronda completa de 12 ejercicios</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            Continuar repasando
          </button>
        </div>
      </div>
    </div>
  );
};
