export type DiscontinuityType = 
  | 'continua' 
  | 'evitable' 
  | 'salto_finito' 
  | 'salto_infinito' 
  | 'segunda_especie';

export interface CurveSegment {
  type: 'function' | 'line' | 'asymptote';
  fn?: (x: number) => number;
  expressionDisplay?: string;
  xMin: number;
  xMax: number;
  dashed?: boolean;
  color?: string;
}

export interface GraphPoint {
  x: number;
  y: number;
  type: 'filled' | 'hollow';
  label?: string;
  color?: string;
}

export interface GraphSpec {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  segments: CurveSegment[];
  points: GraphPoint[];
  asymptotes?: number[]; // x values of vertical asymptotes
  horizontalAsymptotes?: number[]; // y values
}

export interface GraphicalExercise {
  id: number;
  title: string;
  mathExpression: string;
  pointToEvaluate: number; // x = a
  graphSpec: GraphSpec;
  isContinuous: boolean;
  discontinuityType: DiscontinuityType;
  leftLimit: string;
  rightLimit: string;
  generalLimit: string;
  fOfA: string;
  explanation: {
    fOfAExplanation: string;
    limitsExplanation: string;
    conclusionExplanation: string;
  };
}

export interface PiecewisePart {
  expression: string;
  condition: string;
  fn?: (x: number) => number;
}

export interface AnalyticalExercise {
  id: number;
  title: string;
  piecewiseLaTeX: string;
  pointToEvaluate: number; // x = a
  leftPieceIndex: number;
  rightPieceIndex: number;
  exactLeftLimit: string; // e.g. "3", "-2", "0", "+\infty", "-\infty", "No existe"
  exactRightLimit: string;
  exactGeneralLimit: string; // e.g. "3" or "No existe"
  exactFOfA: string; // e.g. "3" or "No definida"
  isEqualLimitAndF: boolean;
  isContinuous: boolean;
  discontinuityType: DiscontinuityType;
  graphSpec?: GraphSpec;
  stepByStepSolution: {
    leftStep: string;
    rightStep: string;
    generalLimitStep: string;
    fOfAStep: string;
    comparisonStep: string;
    conclusion: string;
  };
}

export interface GraphicalAnswer {
  isContinuous: boolean | null;
  discontinuityType: DiscontinuityType | '';
}

export interface AnalyticalAnswer {
  leftLimit: string;
  rightLimit: string;
  generalLimit: string;
  fOfA: string;
  isEqual: boolean | null;
  isContinuous: boolean | null;
  discontinuityType: DiscontinuityType | '';
}

export interface ScoreSummary {
  graphicalTotal: number;
  graphicalCorrect: number;
  analyticalTotal: number;
  analyticalCorrect: number;
  totalPercentage: number;
}
