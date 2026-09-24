import { GraphSpec } from '../types/calculus';

export interface DiscontinuityTheoryItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  formalConditionLaTeX: string;
  exampleFunctionLaTeX: string;
  pointA: number;
  graphSpec: GraphSpec;
  criteriaStatus: {
    fOfA: { exists: boolean; text: string };
    limit: { exists: boolean; text: string };
    equality: { holds: boolean; text: string };
  };
  keyTakeaways: string[];
}

export const THEORY_DISCONTINUITIES: DiscontinuityTheoryItem[] = [
  {
    id: 'continua',
    name: 'Función Continua en un Punto',
    subtitle: 'Cumple los tres criterios fundamentales simultáneamente',
    badge: 'Sin Interrupciones',
    description:
      'Una función f(x) es continua en x = a si su trazo no presenta saltos, huecos ni asíntotas en ese punto. El valor al que se aproxima la curva por ambos lados coincide con el valor exacto de la función evaluada en el punto.',
    formalConditionLaTeX: '\\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = f(a) = L',
    exampleFunctionLaTeX: 'f(x) = x^2 - 1 \\quad \\text{en } x = 2 \\implies f(2) = 3',
    pointA: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -2,
      yMax: 8,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x * x - 1,
          xMin: -1,
          xMax: 3.5,
          color: '#10B981',
        },
      ],
      points: [
        { x: 2, y: 3, type: 'filled', color: '#10B981', label: '(2, 3)' },
      ],
    },
    criteriaStatus: {
      fOfA: { exists: true, text: 'f(2) = 3 (Existe en el dominio)' },
      limit: { exists: true, text: 'lim x→2 f(x) = 3 (Existe; laterales iguales)' },
      equality: { holds: true, text: 'lim x→2 f(x) = f(2) = 3 (Son idénticos)' },
    },
    keyTakeaways: [
      'El lápiz puede trazarse sobre x = a sin despegarse del papel.',
      'Los límites laterales son idénticos y finitos.',
      'f(a) coincide exactamente con el límite.',
    ],
  },
  {
    id: 'evitable',
    name: 'Discontinuidad Evitable o Removible',
    subtitle: 'El límite general existe, pero la función no coincide o no existe allí',
    badge: 'Hueco / Agujero',
    description:
      'Se presenta cuando el límite lateral izquierdo y el derecho existen y son iguales (existe lim_{x→a} f(x) = L), pero f(a) no está definida o está definida en otro valor f(a) ≠ L. Se llama evitable porque basta con redefinir f(a) = L para hacerla continua.',
    formalConditionLaTeX: '\\lim_{x \\to a} f(x) = L \\in \\mathbb{R} \\quad \\text{pero} \\quad f(a) \\neq L \\quad (\\text{o } f(a) \\text{ no existe})',
    exampleFunctionLaTeX: 'f(x) = \\frac{x^2 - 4}{x - 2} \\quad \\text{con } f(2) = 5 \\quad (\\text{Límite } L = 4)',
    pointA: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -1,
      yMax: 7,
      segments: [
        {
          type: 'function',
          fn: (x: number) => x + 2,
          xMin: -1,
          xMax: 4.5,
          color: '#F59E0B',
        },
      ],
      points: [
        { x: 2, y: 4, type: 'hollow', color: '#F59E0B', label: 'Hueco (2, 4)' },
        { x: 2, y: 6, type: 'filled', color: '#3B82F6', label: 'Punto aislado f(2)=6' },
      ],
    },
    criteriaStatus: {
      fOfA: { exists: true, text: 'f(2) = 6 (Está definida fuera de la curva)' },
      limit: { exists: true, text: 'lim x→2 f(x) = 4 (Existe por ambos lados)' },
      equality: { holds: false, text: 'lim x→2 f(x) ≠ f(2) (4 ≠ 6, falla el paso 3)' },
    },
    keyTakeaways: [
      'Existe el límite lim_{x→a} f(x) = L.',
      'La gráfica muestra un agujero (círculo vacío) en (a, L).',
      'Puede ser reparada redefiniendo el punto singular a f(a) = L.',
    ],
  },
  {
    id: 'salto_finito',
    name: 'Discontinuidad Inevitable de Salto Finito',
    subtitle: 'Los límites laterales existen pero son diferentes',
    badge: 'Salto Finito',
    description:
      'Ocurre típicamente en funciones definidas a trozos o con la función escalón / valor absoluto. Ambos límites laterales existen como números reales finitos, pero no coinciden (L1 ≠ L2). La distancia entre ellos es el tamaño del salto: Salto = |L2 - L1| > 0.',
    formalConditionLaTeX: '\\lim_{x \\to a^-} f(x) = L_1, \\; \\lim_{x \\to a^+} f(x) = L_2 \\in \\mathbb{R}, \\quad L_1 \\neq L_2 \\quad (\\text{Salto} = |L_2 - L_1|)',
    exampleFunctionLaTeX: 'f(x) = \\begin{cases} x + 1 & \\text{si } x < 1 \\\\ 4 - x & \\text{si } x \\ge 1 \\end{cases}',
    pointA: 1,
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
          xMax: 1,
          color: '#EC4899',
        },
        {
          type: 'function',
          fn: (x: number) => 4 - x,
          xMin: 1,
          xMax: 4,
          color: '#8B5CF6',
        },
      ],
      points: [
        { x: 1, y: 2, type: 'hollow', color: '#EC4899', label: 'Límit Izq = 2' },
        { x: 1, y: 3, type: 'filled', color: '#8B5CF6', label: 'f(1) = Límit Der = 3' },
      ],
    },
    criteriaStatus: {
      fOfA: { exists: true, text: 'f(1) = 3 (Definida en el segundo tramo)' },
      limit: { exists: false, text: 'lim x→1 f(x) NO existe (Izq=2 ≠ Der=3)' },
      equality: { holds: false, text: 'Al no existir el límite, no puede ser igual a f(1)' },
    },
    keyTakeaways: [
      'Límite lateral izquierdo L1 ≠ Límite lateral derecho L2.',
      'El salto es medible y finito: |3 - 2| = 1 unidad.',
      'No se puede corregir redefiniendo un único punto.',
    ],
  },
  {
    id: 'salto_infinito',
    name: 'Discontinuidad Inevitable de Salto Infinito (Asintótica)',
    subtitle: 'Al menos un límite lateral tiende al infinito (asíntota vertical)',
    badge: 'Asíntota Vertical',
    description:
      'Se presenta cuando al menos uno de los límites laterales crece o decrece sin límite (tiende a +∞ o -∞) al aproximarse a x = a. La recta vertical x = a constituye una asíntota vertical de la función.',
    formalConditionLaTeX: '\\lim_{x \\to a^-} f(x) = \\pm \\infty \\quad \\text{o} \\quad \\lim_{x \\to a^+} f(x) = \\pm \\infty',
    exampleFunctionLaTeX: 'f(x) = \\frac{1}{x - 2} \\quad \\text{en } x = 2 \\quad (\\text{Asíntota } x = 2)',
    pointA: 2,
    graphSpec: {
      xMin: -1,
      xMax: 5,
      yMin: -6,
      yMax: 6,
      asymptotes: [2],
      segments: [
        {
          type: 'function',
          fn: (x: number) => 1 / (x - 2),
          xMin: -1,
          xMax: 1.82,
          color: '#EF4444',
        },
        {
          type: 'function',
          fn: (x: number) => 1 / (x - 2),
          xMin: 2.18,
          xMax: 5,
          color: '#EF4444',
        },
      ],
      points: [],
    },
    criteriaStatus: {
      fOfA: { exists: false, text: 'f(2) No está definida (división por cero)' },
      limit: { exists: false, text: 'lim x→2^- = -∞, lim x→2^+ = +∞ (No existe)' },
      equality: { holds: false, text: 'Ningún valor es finito ni comparable' },
    },
    keyTakeaways: [
      'Al menos un límite lateral diverge a ±∞.',
      'Existe una asíntota vertical x = a.',
      'La función experimenta una ruptura insalvable hacia el infinito.',
    ],
  },
  {
    id: 'segunda_especie',
    name: 'Discontinuidad de Segunda Especie / Otras',
    subtitle: 'Uno o ambos límites laterales no existen (no oscila o no está definida)',
    badge: 'Segunda Especie',
    description:
      'Se clasifica como de segunda especie cuando al menos uno de los límites laterales no existe en absoluto (no tiende a ningún número ni diverge ordenadamente a ±∞), por ejemplo en funciones oscilatorias salvajes como f(x) = sin(1/x) cerca del 0, o cuando la función no existe en un lado del punto dentro de los reales.',
    formalConditionLaTeX: '\\nexists \\lim_{x \\to a^-} f(x) \\quad \\text{o} \\quad \\nexists \\lim_{x \\to a^+} f(x) \\quad (\\text{oscilación o fuera de dominio})',
    exampleFunctionLaTeX: 'f(x) = \\begin{cases} \\sin\\left(\\frac{1}{x}\\right) & \\text{si } x > 0 \\\\ 1 & \\text{si } x \\le 0 \\end{cases} \\quad \\text{en } x = 0',
    pointA: 0,
    graphSpec: {
      xMin: -3,
      xMax: 3,
      yMin: -2,
      yMax: 2,
      segments: [
        {
          type: 'function',
          fn: (x: number) => 1,
          xMin: -3,
          xMax: 0,
          color: '#06B6D4',
        },
        {
          type: 'function',
          fn: (x: number) => Math.sin(1 / x),
          xMin: 0.05,
          xMax: 3,
          color: '#3B82F6',
        },
      ],
      points: [
        { x: 0, y: 1, type: 'filled', color: '#06B6D4', label: 'f(0) = 1' },
      ],
    },
    criteriaStatus: {
      fOfA: { exists: true, text: 'f(0) = 1 (Definida por la izquierda)' },
      limit: { exists: false, text: 'Por derecha oscila infinitamente entre -1 y 1' },
      equality: { holds: false, text: 'No existe límite general para comparar' },
    },
    keyTakeaways: [
      'Al menos un límite lateral no existe (ni finito ni asintótico).',
      'Común en fenómenos de oscilación extrema f(x) = sin(1/x) o dominio semiacotado.',
      'Representa una discontinuidad esencial sin límite determinado.',
    ],
  },
];
