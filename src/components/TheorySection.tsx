import React, { useState } from 'react';
import { MathView } from './MathView';
import { CalculusGraph } from './CalculusGraph';
import { THEORY_DISCONTINUITIES, DiscontinuityTheoryItem } from '../data/theoryData';
import { CheckCircle2, XCircle, ArrowRight, Play, RefreshCw, Sparkles, BookOpen, Layers } from 'lucide-react';

interface TheorySectionProps {
  isDarkMode: boolean;
  onGoToPractice1: () => void;
  onGoToPractice2: () => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  isDarkMode,
  onGoToPractice1,
  onGoToPractice2,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('continua');
  const [activeLimitAnimation, setActiveLimitAnimation] = useState<'left' | 'right' | 'both' | null>(null);

  const currentItem: DiscontinuityTheoryItem =
    THEORY_DISCONTINUITIES.find(d => d.id === selectedCaseId) || THEORY_DISCONTINUITIES[0];

  const handleTriggerAnimation = (side: 'left' | 'right' | 'both') => {
    setActiveLimitAnimation(null);
    setTimeout(() => {
      setActiveLimitAnimation(side);
    }, 40);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Editorial Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-4 h-4" />
          <span>Fundamentos de Cálculo Diferencial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Criterios de Continuidad y Tipos de Discontinuidades
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Comprende con rigor matemático y claridad visual cuándo una función es continua en un punto
          y cómo clasificar sus posibles rupturas mediante límites laterales.
        </p>
      </section>

      {/* Los 3 Criterios Formales de Continuidad */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Los Tres Criterios Formales de Continuidad
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Una función <MathView math="f(x)" /> es continua en el punto <MathView math="x = a" /> si y solo si se verifican simultáneamente estas tres condiciones:
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 shrink-0 self-start md:self-auto text-xs font-semibold">
            <span>Regla de Oro:</span>
            <MathView math="\lim_{x \to a} f(x) = f(a)" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Criterio 1 */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Existencia de <MathView math="f(a)" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
                El valor <MathView math="a" /> debe pertenecer al dominio de la función. No puede resultar en división entre cero o raíces inválidas.
              </p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              <MathView math="f(a) \in \mathbb{R} \quad (\exists f(a))" />
            </div>
          </div>

          {/* Criterio 2 */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Existencia de <MathView math="\lim_{x \to a} f(x)" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
                Los dos límites laterales deben existir, ser finitos y coincidir exactamente en el mismo valor real <MathView math="L" />.
              </p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              <MathView math="\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L" />
            </div>
          </div>

          {/* Criterio 3 */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Coincidencia Total
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
                El valor límite de aproximación bilateral debe ser estrictamente idéntico al valor que toma la función en ese punto.
              </p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              <MathView math="\lim_{x \to a} f(x) = f(a)" />
            </div>
          </div>
        </div>
      </section>

      {/* Laboratorio Interactivo: Simulador de Casos */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Simulador de Laboratorio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Explorador Gráfico e Interactivo de Casos
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en los tipos para ver la gráfica y evaluar los 3 criterios
          </span>
        </div>

        {/* Case selector tabs */}
        <div className="flex flex-wrap gap-2">
          {THEORY_DISCONTINUITIES.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedCaseId(item.id);
                setActiveLimitAnimation(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCaseId === item.id
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* 2-Zone Sandbox: Stage & Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Zone: Graph Canvas Stage (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                Punto analizado: x = {currentItem.pointA}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentItem.badge}
              </span>
            </div>

            {/* Interactive Graph */}
            <div className="w-full">
              <CalculusGraph
                spec={currentItem.graphSpec}
                pointToEvaluate={currentItem.pointA}
                highlightLeftLimit={activeLimitAnimation === 'left'}
                highlightRightLimit={activeLimitAnimation === 'right'}
                highlightBothLimits={activeLimitAnimation === 'both'}
                isDarkMode={isDarkMode}
                width={520}
                height={320}
              />
            </div>

            {/* Animation Controls: Left, Right, and Both simultaneous limits */}
            <div className="w-full mt-4 flex flex-col items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => handleTriggerAnimation('left')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <Play className="w-3.5 h-3.5" />
                  <span>Límite Izquierdo (x → {currentItem.pointA}⁻)</span>
                </button>

                <button
                  onClick={() => handleTriggerAnimation('right')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <Play className="w-3.5 h-3.5" />
                  <span>Límite Derecho (x → {currentItem.pointA}⁺)</span>
                </button>

                {activeLimitAnimation && (
                  <button
                    onClick={() => setActiveLimitAnimation(null)}
                    className="p-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Detener animación"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Botón Ambos Límites Simultáneos debajo de los laterales */}
              <button
                onClick={() => handleTriggerAnimation('both')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ambos Límites Simultáneos (x → {currentItem.pointA}⁻ y x → {currentItem.pointA}⁺)</span>
              </button>
            </div>
          </div>

          {/* Right Zone: Control & Verification Deck (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentItem.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentItem.subtitle}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentItem.description}
            </p>

            {/* Formula Block */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Condición analítica:
              </span>
              <MathView math={currentItem.formalConditionLaTeX} block />
            </div>

            {/* Verification of the 3 Criteria for this case */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chequeo de los 3 Criterios en x = {currentItem.pointA}
              </span>

              {/* Criterion 1 Status */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                currentItem.criteriaStatus.fOfA.exists
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              }`}>
                {currentItem.criteriaStatus.fOfA.exists ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Paso 1: ¿Existe f({currentItem.pointA})?
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {currentItem.criteriaStatus.fOfA.text}
                  </span>
                </div>
              </div>

              {/* Criterion 2 Status */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                currentItem.criteriaStatus.limit.exists
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              }`}>
                {currentItem.criteriaStatus.limit.exists ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Paso 2: ¿Existe lim x→{currentItem.pointA} f(x)?
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {currentItem.criteriaStatus.limit.text}
                  </span>
                </div>
              </div>

              {/* Criterion 3 Status */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                currentItem.criteriaStatus.equality.holds
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              }`}>
                {currentItem.criteriaStatus.equality.holds ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Paso 3: ¿lim x→{currentItem.pointA} f(x) = f({currentItem.pointA})?
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {currentItem.criteriaStatus.equality.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Key takeaways bullets */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Claves para identificarla:
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                {currentItem.keyTakeaways.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo Teórico Detallado de las 4 Discontinuidades */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Clasificación Exhaustiva de Discontinuidades
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resumen visual y analítico para preparar tus ejercicios prácticos y exámenes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Evitable */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                Tipo 1
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Límite bilateral existe
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Discontinuidad Evitable o Removible
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Ocurre cuando el límite bilateral existe y es un número real <MathView math="L" />, pero la función no está definida en <MathView math="x = a" /> o está asignada a otro valor distinto <MathView math="f(a) \neq L" />.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 font-mono">
              <p>• Gráfica: Se aprecia un punto hueco en (a, L).</p>
              <p>• Solución: Se redefine haciendo f(a) = L.</p>
            </div>
          </div>

          {/* 2. Salto Finito */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                Tipo 2
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Laterales finitos distintos
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Discontinuidad Inevitable de Salto Finito
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Ambos límites laterales existen como valores finitos en <MathView math="\mathbb{R}" />, pero tienen resultados numéricos distintos: <MathView math="L_1 \neq L_2" />.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 font-mono">
              <p>• Magnitud del salto: k = |L₂ - L₁| &gt; 0.</p>
              <p>• Gráfica: Ruptura visible de escalón entre dos tramos.</p>
            </div>
          </div>

          {/* 3. Salto Infinito */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                Tipo 3
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Asíntota Vertical
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Discontinuidad Inevitable de Salto Infinito
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Al menos uno de los límites laterales tiende hacia el infinito (<MathView math="+\infty" /> o <MathView math="-\infty" />). La recta vertical <MathView math="x = a" /> actúa como asíntota vertical.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 font-mono">
              <p>• Comportamiento: La curva diverge sin acotación.</p>
              <p>• Característica: Frecuente en fracciones con denominador cero.</p>
            </div>
          </div>

          {/* 4. Segunda Especie */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                Tipo 4
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                No existe lateral
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Discontinuidad de Segunda Especie / Otras
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Al menos uno de los límites laterales no existe en absoluto (no converge a ningún número real ni a infinito ordenado, por ejemplo oscilación infinita o frontera del dominio).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 font-mono">
              <p>• Ejemplos: f(x) = sen(1/x) en 0; f(x) = √x por la izquierda.</p>
              <p>• No es posible salvarla ni mediante saltos algebraicos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct CTAs to Practice */}
      <section className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold">
            ¿Listo para poner a prueba tus conocimientos?
          </h3>
          <p className="text-indigo-200 text-sm max-w-xl">
            Comienza con el análisis gráfico interactivo o profundiza en las funciones analíticas a trozos. El sistema seleccionará 6 ejercicios aleatorios de un pool de 20.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={onGoToPractice1}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <span>Práctica 1: Gráfica</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToPractice2}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-sm transition-colors border border-indigo-500/50"
          >
            <span>Práctica 2: Analítica</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
