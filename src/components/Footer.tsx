import React from 'react';
import { Heart, Sparkles, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Cálculo Diferencial · Tipos de Discontinuidades y Continuidad de Funciones
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Plataforma interactiva para la exploración conceptual, gráfica y analítica de límites
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <span>Aplicación creada por:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                Teresa Floriano
              </strong>
            </div>
            <p className="text-2xs text-slate-400 dark:text-slate-500">
              Diseño EdTech para Cálculo Diferencial
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
