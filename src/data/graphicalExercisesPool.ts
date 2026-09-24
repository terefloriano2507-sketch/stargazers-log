import { GraphicalExercise } from '../types/calculus';

export const GRAPHICAL_EXERCISES_POOL: GraphicalExercise[] = [
  // 1. Evitable - Hueco sin punto f(a)
  {
    id: 1,
    title: 'Función Racional con Hueco Púramente Desconocido',
    mathExpression: 'f(x) = \\frac{x^2 - 1}{x - 1}',
    pointToEvaluate: 1,
    graphSpec: {
      xMin: -2,
      xMax: 4,
      yMin: -1,
      yMax: 5,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x + 1,
          xMin: -2,
          xMax: 4,
          color: '#3B82F6',
        },
      ],
      points: [
        { x: 1, y: 2, type: 'hollow', color: '#3B82F6', label: '(1, 2) hueco' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'evitable',
    leftLimit: '2',
    rightLimit: '2',
    generalLimit: '2',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(1) no está definida debido a división entre cero en la expresión original.',
      limitsExplanation: 'lim_{x→1^-} f(x) = 2 y lim_{x→1^+} f(x) = 2. Como son iguales, lim_{x→1} f(x) = 2.',
      conclusionExplanation: 'Existe el límite finito (L = 2), pero f(1) no existe. Por tanto, es una Discontinuidad Evitable o Removible.',
    },
  },

  // 2. Salto Finito clásico
  {
    id: 2,
    title: 'Función por Tramos con Escalonamiento',
    mathExpression: 'f(x) = \\begin{cases} x + 2 & \\text{si } x < 0 \\\\ 1 - x & \\text{si } x \\ge 0 \\end{cases}',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -3,
      xMax: 3,
      yMin: -2,
      yMax: 4,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x + 2,
          xMin: -3,
          xMax: 0,
          color: '#EC4899',
        },
        {
          type: 'function',
          fn: (x: number) => 1 - x,
          xMin: 0,
          xMax: 3,
          color: '#8B5CF6',
        },
      ],
      points: [
        { x: 0, y: 2, type: 'hollow', color: '#EC4899', label: '(0, 2)' },
        { x: 0, y: 1, type: 'filled', color: '#8B5CF6', label: '(0, 1)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_finito',
    leftLimit: '2',
    rightLimit: '1',
    generalLimit: 'No existe',
    fOfA: '1',
    explanation: {
      fOfAExplanation: 'f(0) está definida en el segundo tramo: f(0) = 1 - 0 = 1.',
      limitsExplanation: 'Por la izquierda: lim_{x→0^-} f(x) = 2. Por la derecha: lim_{x→0^+} f(x) = 1.',
      conclusionExplanation: 'Los límites laterales son distintos (2 ≠ 1). El límite general no existe y el salto es |1 - 2| = 1. Es Discontinuidad Inevitable de Salto Finito.',
    },
  },

  // 3. Salto Infinito (Asíntota vertical bilateral)
  {
    id: 3,
    title: 'Hipérbola con Asíntota Vertical en x = 2',
    mathExpression: 'f(x) = \\frac{1}{x - 2}',
    pointToEvaluate: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      asymptotes: [2],
      segments: [
        {
          type: 'function',
          fn: (x: number) => 1 / (x - 2),
          xMin: -1,
          xMax: 1.8,
          color: '#EF4444',
        },
        {
          type: 'function',
          fn: (x: number) => 1 / (x - 2),
          xMin: 2.2,
          xMax: 5,
          color: '#EF4444',
        },
      ],
      points: [],
    },
    isContinuous: false,
    discontinuityType: 'salto_infinito',
    leftLimit: '-\\infty',
    rightLimit: '+\\infty',
    generalLimit: 'No existe',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(2) no está definida (denominador cero).',
      limitsExplanation: 'lim_{x→2^-} f(x) = -∞ y lim_{x→2^+} f(x) = +∞.',
      conclusionExplanation: 'Al divergir a infinito, existe una asíntota vertical en x = 2. Es Discontinuidad Inevitable de Salto Infinito (Asintótica).',
    },
  },

  // 4. Continua Suave
  {
    id: 4,
    title: 'Parábola Cuadrática Continua',
    mathExpression: 'f(x) = -x^2 + 4',
    pointToEvaluate: 1,
    graphSpec: {
      xMin: -2,
      xMax: 4,
      yMin: -5,
      yMax: 5,
      segments: [
        {
          type: 'function',
          fn: (x: number) => -x * x + 4,
          xMin: -2,
          xMax: 3.5,
          color: '#10B981',
        },
      ],
      points: [
        { x: 1, y: 3, type: 'filled', color: '#10B981', label: '(1, 3)' },
      ],
    },
    isContinuous: true,
    discontinuityType: 'continua',
    leftLimit: '3',
    rightLimit: '3',
    generalLimit: '3',
    fOfA: '3',
    explanation: {
      fOfAExplanation: 'f(1) = -(1)^2 + 4 = 3 (Existe).',
      limitsExplanation: 'lim_{x→1^-} f(x) = 3 y lim_{x→1^+} f(x) = 3, por lo tanto lim_{x→1} f(x) = 3.',
      conclusionExplanation: 'lim_{x→1} f(x) = f(1) = 3. Cumple estrictamente los 3 criterios de continuidad.',
    },
  },

  // 5. Evitable con Punto Aislado Desplazado
  {
    id: 5,
    title: 'Línea con Punto Aislado Desplazado',
    mathExpression: 'f(x) = \\begin{cases} x + 1 & \\text{si } x \\neq 2 \\\\ 5 & \\text{si } x = 2 \\end{cases}',
    pointToEvaluate: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -1,
      yMax: 6,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x + 1,
          xMin: -1,
          xMax: 4.5,
          color: '#F59E0B',
        },
      ],
      points: [
        { x: 2, y: 3, type: 'hollow', color: '#F59E0B', label: 'Hueco (2, 3)' },
        { x: 2, y: 5, type: 'filled', color: '#3B82F6', label: 'Punto f(2)=5' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'evitable',
    leftLimit: '3',
    rightLimit: '3',
    generalLimit: '3',
    fOfA: '5',
    explanation: {
      fOfAExplanation: 'f(2) = 5 (Existe y está definida explícitamente).',
      limitsExplanation: 'Por ambos lados, la recta se aproxima a y = 3: lim_{x→2} f(x) = 3.',
      conclusionExplanation: 'El límite existe (L = 3) y f(2) existe (5), pero lim_{x→2} f(x) ≠ f(2) (3 ≠ 5). Falla el criterio 3; es Discontinuidad Evitable.',
    },
  },

  // 6. Continua en Unión de Tramos Coincidentes
  {
    id: 6,
    title: 'Función por Tramos con Empalme Continuo',
    mathExpression: 'f(x) = \\begin{cases} 2x & \\text{si } x \\le 1 \\\\ 3 - x & \\text{si } x > 1 \\end{cases}',
    pointToEvaluate: 1,
    graphSpec: {
      xMin: -2,
      xMax: 4,
      yMin: -2,
      yMax: 4,
      segments: [
        {
          type: 'function',
          fn: (x: number) => 2 * x,
          xMin: -2,
          xMax: 1,
          color: '#10B981',
        },
        {
          type: 'function',
          fn: (x: number) => 3 - x,
          xMin: 1,
          xMax: 4,
          color: '#10B981',
        },
      ],
      points: [
        { x: 1, y: 2, type: 'filled', color: '#10B981', label: 'Empalme (1, 2)' },
      ],
    },
    isContinuous: true,
    discontinuityType: 'continua',
    leftLimit: '2',
    rightLimit: '2',
    generalLimit: '2',
    fOfA: '2',
    explanation: {
      fOfAExplanation: 'f(1) = 2(1) = 2.',
      limitsExplanation: 'lim_{x→1^-} (2x) = 2 y lim_{x→1^+} (3 - x) = 2. Límite general = 2.',
      conclusionExplanation: 'Tanto el límite como el valor de la función son 2. La gráfica se une sin discontinuidad.',
    },
  },

  // 7. Salto Infinito con asíntota unilateral positiva / negativa
  {
    id: 7,
    title: 'Función Racional Asintótica Cuadrática',
    mathExpression: 'f(x) = \\frac{1}{(x + 1)^2}',
    pointToEvaluate: -1,
    graphSpec: {
      xMin: -4,
      xMax: 2,
      yMin: -1,
      yMax: 6,
      asymptotes: [-1],
      segments: [
        {
          type: 'function',
          fn: (x: number) => 1 / Math.pow(x + 1, 2),
          xMin: -4,
          xMax: -1.3,
          color: '#EF4444',
        },
        {
          type: 'function',
          fn: (x: number) => 1 / Math.pow(x + 1, 2),
          xMin: -0.7,
          xMax: 2,
          color: '#EF4444',
        },
      ],
      points: [],
    },
    isContinuous: false,
    discontinuityType: 'salto_infinito',
    leftLimit: '+\\infty',
    rightLimit: '+\\infty',
    generalLimit: '+\\infty',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(-1) genera división por cero, no está definida.',
      limitsExplanation: 'Ambos límites laterales crecen positivamente hacia +∞.',
      conclusionExplanation: 'Al divergir a infinito, existe una asíntota vertical en x = -1. Es Discontinuidad Inevitable de Salto Infinito.',
    },
  },

  // 8. Salto Finito con tramo constante y tramo lineal
  {
    id: 8,
    title: 'Tramo Escalón con Salto Finito Negativo',
    mathExpression: 'f(x) = \\begin{cases} 3 & \\text{si } x \\le 2 \\\\ x - 1 & \\text{si } x > 2 \\end{cases}',
    pointToEvaluate: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -1,
      yMax: 5,
      segments: [
        {
          type: 'function',
          fn: () => 3,
          xMin: -1,
          xMax: 2,
          color: '#0284C7',
        },
        {
          type: 'function',
          fn: (x: number) => x - 1,
          xMin: 2,
          xMax: 5,
          color: '#EC4899',
        },
      ],
      points: [
        { x: 2, y: 3, type: 'filled', color: '#0284C7', label: 'f(2)=3' },
        { x: 2, y: 1, type: 'hollow', color: '#EC4899', label: '(2, 1)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_finito',
    leftLimit: '3',
    rightLimit: '1',
    generalLimit: 'No existe',
    fOfA: '3',
    explanation: {
      fOfAExplanation: 'f(2) = 3 (tramo constante).',
      limitsExplanation: 'lim_{x→2^-} f(x) = 3, mientras que lim_{x→2^+} f(x) = 2 - 1 = 1.',
      conclusionExplanation: 'Límites laterales distintos (3 ≠ 1). Salto finito de magnitud |1 - 3| = 2 unidades.',
    },
  },

  // 9. Segunda Especie / Oscilatoria
  {
    id: 9,
    title: 'Función Oscilante Topológica en el Origen',
    mathExpression: 'f(x) = \\sin(1/x) \\quad \\text{para } x > 0, \\quad f(0) = 0',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -2,
      xMax: 2,
      yMin: -2,
      yMax: 2,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x,
          xMin: -2,
          xMax: 0,
          color: '#06B6D4',
        },
        {
          type: 'function',
          fn: (x: number) => Math.sin(1 / x),
          xMin: 0.05,
          xMax: 2,
          color: '#6366F1',
        },
      ],
      points: [
        { x: 0, y: 0, type: 'filled', color: '#06B6D4', label: 'f(0)=0' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'segunda_especie',
    leftLimit: '0',
    rightLimit: 'No existe (oscila)',
    generalLimit: 'No existe',
    fOfA: '0',
    explanation: {
      fOfAExplanation: 'f(0) = 0 está asignado.',
      limitsExplanation: 'Por izquierda tiende a 0, pero por la derecha oscila infinitamente entre -1 y 1 sin converger a ningún valor.',
      conclusionExplanation: 'Al no existir el límite lateral derecho por oscilación infinita, es una Discontinuidad de Segunda Especie.',
    },
  },

  // 10. Continua Función Cúbica
  {
    id: 10,
    title: 'Polinomio Cúbico Continuo',
    mathExpression: 'f(x) = x^3 - 3x',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -2.5,
      xMax: 2.5,
      yMin: -3,
      yMax: 3,
      segments: [
        {
          type: 'function',
          fn: (x: number) => Math.pow(x, 3) - 3 * x,
          xMin: -2.2,
          xMax: 2.2,
          color: '#10B981',
        },
      ],
      points: [
        { x: 0, y: 0, type: 'filled', color: '#10B981', label: '(0, 0)' },
      ],
    },
    isContinuous: true,
    discontinuityType: 'continua',
    leftLimit: '0',
    rightLimit: '0',
    generalLimit: '0',
    fOfA: '0',
    explanation: {
      fOfAExplanation: 'f(0) = (0)^3 - 3(0) = 0.',
      limitsExplanation: 'lim_{x→0^-} f(x) = 0 y lim_{x→0^+} f(x) = 0.',
      conclusionExplanation: 'El límite existe y es igual a f(0) = 0. Es continua en x = 0.',
    },
  },

  // 11. Evitable - Racional Factorizable
  {
    id: 11,
    title: 'Función Racional Factorizable en x = -2',
    mathExpression: 'f(x) = \\frac{x^2 - 4}{x + 2}',
    pointToEvaluate: -2,
    graphSpec: {
      xMin: -5,
      xMax: 2,
      yMin: -6,
      yMax: 2,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x - 2,
          xMin: -5,
          xMax: 2,
          color: '#F59E0B',
        },
      ],
      points: [
        { x: -2, y: -4, type: 'hollow', color: '#F59E0B', label: 'Hueco (-2, -4)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'evitable',
    leftLimit: '-4',
    rightLimit: '-4',
    generalLimit: '-4',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(-2) no está definida por división 0/0.',
      limitsExplanation: 'Simplificando: (x-2)(x+2)/(x+2) = x-2. lim_{x→-2} f(x) = -4.',
      conclusionExplanation: 'El límite lateral por ambos lados da -4, pero el punto no existe en la gráfica. Discontinuidad Evitable.',
    },
  },

  // 12. Salto Finito Valor Absoluto / x
  {
    id: 12,
    title: 'Función Signo / Valor Absoluto Normalizado',
    mathExpression: 'f(x) = \\frac{|x|}{x}',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -3,
      xMax: 3,
      yMin: -2,
      yMax: 2,
      segments: [
        {
          type: 'function',
          fn: () => -1,
          xMin: -3,
          xMax: 0,
          color: '#6366F1',
        },
        {
          type: 'function',
          fn: () => 1,
          xMin: 0,
          xMax: 3,
          color: '#6366F1',
        },
      ],
      points: [
        { x: 0, y: -1, type: 'hollow', color: '#6366F1', label: '(0, -1)' },
        { x: 0, y: 1, type: 'hollow', color: '#6366F1', label: '(0, 1)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_finito',
    leftLimit: '-1',
    rightLimit: '1',
    generalLimit: 'No existe',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(0) no está definida.',
      limitsExplanation: 'lim_{x→0^-} f(x) = -1 y lim_{x→0^+} f(x) = 1.',
      conclusionExplanation: 'Los límites laterales existen y son números reales distintos (-1 ≠ 1). Es Discontinuidad Inevitable de Salto Finito (salto = 2).',
    },
  },

  // 13. Salto Infinito Asintótica en x = -3
  {
    id: 13,
    title: 'Racional Asintótica en x = -3',
    mathExpression: 'f(x) = \\frac{2}{x + 3}',
    pointToEvaluate: -3,
    graphSpec: {
      xMin: -6,
      xMax: 0,
      yMin: -6,
      yMax: 6,
      asymptotes: [-3],
      segments: [
        {
          type: 'function',
          fn: (x: number) => 2 / (x + 3),
          xMin: -6,
          xMax: -3.2,
          color: '#EF4444',
        },
        {
          type: 'function',
          fn: (x: number) => 2 / (x + 3),
          xMin: -2.8,
          xMax: 0,
          color: '#EF4444',
        },
      ],
      points: [],
    },
    isContinuous: false,
    discontinuityType: 'salto_infinito',
    leftLimit: '-\\infty',
    rightLimit: '+\\infty',
    generalLimit: 'No existe',
    fOfA: 'No definida',
    explanation: {
      fOfAExplanation: 'f(-3) no está definida.',
      limitsExplanation: 'Por la izquierda tiende a -∞ y por la derecha a +∞.',
      conclusionExplanation: 'Presenta una asíntota vertical en x = -3. Discontinuidad Inevitable de Salto Infinito.',
    },
  },

  // 14. Continua con Función Coseno
  {
    id: 14,
    title: 'Función Coseno Periódica Continua',
    mathExpression: 'f(x) = 2\\cos(x)',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -3.5,
      xMax: 3.5,
      yMin: -3,
      yMax: 3,
      segments: [
        {
          type: 'function',
          fn: (x: number) => 2 * Math.cos(x),
          xMin: -3.5,
          xMax: 3.5,
          color: '#10B981',
        },
      ],
      points: [
        { x: 0, y: 2, type: 'filled', color: '#10B981', label: '(0, 2)' },
      ],
    },
    isContinuous: true,
    discontinuityType: 'continua',
    leftLimit: '2',
    rightLimit: '2',
    generalLimit: '2',
    fOfA: '2',
    explanation: {
      fOfAExplanation: 'f(0) = 2 cos(0) = 2(1) = 2.',
      limitsExplanation: 'Por ser función trigonométrica estándar continua, lim_{x→0} 2cos(x) = 2.',
      conclusionExplanation: 'Existe f(0), existe el límite y coinciden (2 = 2). La función es continua en x = 0.',
    },
  },

  // 15. Salto Finito con Parábola y Recta
  {
    id: 15,
    title: 'Parábola y Recta con Desfase en x = 2',
    mathExpression: 'f(x) = \\begin{cases} x^2 & \\text{si } x < 2 \\\\ 2 & \\text{si } x \\ge 2 \\end{cases}',
    pointToEvaluate: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -1,
      yMax: 6,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x * x,
          xMin: -1,
          xMax: 2,
          color: '#F97316',
        },
        {
          type: 'function',
          fn: () => 2,
          xMin: 2,
          xMax: 5,
          color: '#3B82F6',
        },
      ],
      points: [
        { x: 2, y: 4, type: 'hollow', color: '#F97316', label: '(2, 4)' },
        { x: 2, y: 2, type: 'filled', color: '#3B82F6', label: '(2, 2)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_finito',
    leftLimit: '4',
    rightLimit: '2',
    generalLimit: 'No existe',
    fOfA: '2',
    explanation: {
      fOfAExplanation: 'f(2) = 2.',
      limitsExplanation: 'lim_{x→2^-} x^2 = 4; lim_{x→2^+} 2 = 2.',
      conclusionExplanation: 'Límites laterales distintos (4 ≠ 2). Discontinuidad Inevitable de Salto Finito (salto = 2).',
    },
  },

  // 16. Evitable con Punto Aislado Inferior
  {
    id: 16,
    title: 'Parábola con Vértice Desplazado al Eje X',
    mathExpression: 'f(x) = \\begin{cases} (x-1)^2 + 2 & \\text{si } x \\neq 1 \\\\ 0 & \\text{si } x = 1 \\end{cases}',
    pointToEvaluate: 1,
    graphSpec: {
      xMin: -1,
      xMax: 3,
      yMin: -1,
      yMax: 5,
      segments: [
        {
          type: 'function',
          fn: (x: number) => Math.pow(x - 1, 2) + 2,
          xMin: -1,
          xMax: 3,
          color: '#8B5CF6',
        },
      ],
      points: [
        { x: 1, y: 2, type: 'hollow', color: '#8B5CF6', label: 'Hueco (1, 2)' },
        { x: 1, y: 0, type: 'filled', color: '#10B981', label: 'Punto f(1)=0' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'evitable',
    leftLimit: '2',
    rightLimit: '2',
    generalLimit: '2',
    fOfA: '0',
    explanation: {
      fOfAExplanation: 'f(1) = 0 está definida.',
      limitsExplanation: 'Por la izquierda y por la derecha la curva tiende a 2: lim_{x→1} f(x) = 2.',
      conclusionExplanation: 'lim_{x→1} f(x) = 2 pero f(1) = 0 (2 ≠ 0). Discontinuidad Evitable.',
    },
  },

  // 17. Continua Valor Absoluto Suave en Vértice
  {
    id: 17,
    title: 'Vértice de Función Valor Absoluto',
    mathExpression: 'f(x) = |x - 2| + 1',
    pointToEvaluate: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: 0,
      yMax: 5,
      segments: [
        {
          type: 'function',
          fn: (x: number) => Math.abs(x - 2) + 1,
          xMin: -1,
          xMax: 5,
          color: '#10B981',
        },
      ],
      points: [
        { x: 2, y: 1, type: 'filled', color: '#10B981', label: '(2, 1)' },
      ],
    },
    isContinuous: true,
    discontinuityType: 'continua',
    leftLimit: '1',
    rightLimit: '1',
    generalLimit: '1',
    fOfA: '1',
    explanation: {
      fOfAExplanation: 'f(2) = |2 - 2| + 1 = 1.',
      limitsExplanation: 'lim_{x→2^-} f(x) = 1 y lim_{x→2^+} f(x) = 1.',
      conclusionExplanation: 'Aunque hay una esquina en la gráfica (no es diferenciable allí), SÍ es continua porque el trazo no se corta.',
    },
  },

  // 18. Salto Infinito con Límite Izquierdo Finito y Derecho Infinito
  {
    id: 18,
    title: 'Discontinuidad Asintótica Unilateral Mixta',
    mathExpression: 'f(x) = \\begin{cases} x + 1 & \\text{si } x \\le 0 \\\\ \\frac{1}{x} & \\text{si } x > 0 \\end{cases}',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -3,
      xMax: 3,
      yMin: -2,
      yMax: 6,
      asymptotes: [0],
      segments: [
        {
          type: 'function',
          fn: (x: number) => x + 1,
          xMin: -3,
          xMax: 0,
          color: '#3B82F6',
        },
        {
          type: 'function',
          fn: (x: number) => 1 / x,
          xMin: 0.2,
          xMax: 3,
          color: '#EF4444',
        },
      ],
      points: [
        { x: 0, y: 1, type: 'filled', color: '#3B82F6', label: '(0, 1)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_infinito',
    leftLimit: '1',
    rightLimit: '+\\infty',
    generalLimit: 'No existe',
    fOfA: '1',
    explanation: {
      fOfAExplanation: 'f(0) = 0 + 1 = 1.',
      limitsExplanation: 'lim_{x→0^-} f(x) = 1, pero lim_{x→0^+} f(x) = +∞.',
      conclusionExplanation: 'Basta con que uno de los límites laterales sea infinito para ser Discontinuidad Inevitable de Salto Infinito.',
    },
  },

  // 19. Segunda Especie Raíz Cuadrada en x = 0 (Borde de Dominio)
  {
    id: 19,
    title: 'Borde de Dominio en Raíz Cuadrada',
    mathExpression: 'f(x) = \\begin{cases} \\sqrt{x} & \\text{si } x \\ge 0 \\\\ \\text{No def.} & \\text{si } x < 0 \\end{cases}',
    pointToEvaluate: 0,
    graphSpec: {
      xMin: -2,
      xMax: 4,
      yMin: -1,
      yMax: 3,
      segments: [
        {
          type: 'function',
          fn: (x: number) => Math.sqrt(Math.max(0, x)),
          xMin: 0,
          xMax: 4,
          color: '#06B6D4',
        },
      ],
      points: [
        { x: 0, y: 0, type: 'filled', color: '#06B6D4', label: '(0, 0)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'segunda_especie',
    leftLimit: 'No existe (fuera de dominio)',
    rightLimit: '0',
    generalLimit: 'No existe',
    fOfA: '0',
    explanation: {
      fOfAExplanation: 'f(0) = 0.',
      limitsExplanation: 'lim_{x→0^+} \\sqrt{x} = 0, pero lim_{x→0^-} no existe en los reales.',
      conclusionExplanation: 'Al no existir el límite por la izquierda en los reales, se clasifica como Discontinuidad de Segunda Especie / Borde.',
    },
  },

  // 20. Salto Finito con Tramos Cuadráticos Opuestos
  {
    id: 20,
    title: 'Dos Ramas Parabólicas Opuestas con Salto',
    mathExpression: 'f(x) = \\begin{cases} -x^2 + 2 & \\text{si } x \\le 1 \\\\ x^2 + 2 & \\text{si } x > 1 \\end{cases}',
    pointToEvaluate: 1,
    graphSpec: {
      xMin: -1,
      xMax: 3,
      yMin: -1,
      yMax: 6,
      segments: [
        {
          type: 'function',
          fn: (x: number) => -x * x + 2,
          xMin: -1,
          xMax: 1,
          color: '#F43F5E',
        },
        {
          type: 'function',
          fn: (x: number) => x * x + 2,
          xMin: 1,
          xMax: 2.2,
          color: '#8B5CF6',
        },
      ],
      points: [
        { x: 1, y: 1, type: 'filled', color: '#F43F5E', label: 'f(1)=1' },
        { x: 1, y: 3, type: 'hollow', color: '#8B5CF6', label: '(1, 3)' },
      ],
    },
    isContinuous: false,
    discontinuityType: 'salto_finito',
    leftLimit: '1',
    rightLimit: '3',
    generalLimit: 'No existe',
    fOfA: '1',
    explanation: {
      fOfAExplanation: 'f(1) = -(1)^2 + 2 = 1.',
      limitsExplanation: 'lim_{x→1^-} (-x^2 + 2) = 1; lim_{x→1^+} (x^2 + 2) = 3.',
      conclusionExplanation: 'Límites laterales finitos y desiguales (1 ≠ 3). Salto finito de 2 unidades.',
    },
  },
];
