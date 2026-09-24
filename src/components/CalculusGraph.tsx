import React, { useState, useEffect, useRef } from 'react';
import { GraphSpec } from '../types/calculus';

interface CalculusGraphProps {
  spec: GraphSpec;
  pointToEvaluate?: number;
  highlightLeftLimit?: boolean;
  highlightRightLimit?: boolean;
  highlightBothLimits?: boolean;
  isDarkMode?: boolean;
  interactiveX?: number | null;
  onInteractiveXChange?: (x: number) => void;
  width?: number;
  height?: number;
  showCoordinatesHover?: boolean;
}

export const CalculusGraph: React.FC<CalculusGraphProps> = ({
  spec,
  pointToEvaluate,
  highlightLeftLimit = false,
  highlightRightLimit = false,
  highlightBothLimits = false,
  isDarkMode = false,
  interactiveX = null,
  onInteractiveXChange,
  width = 500,
  height = 340,
  showCoordinatesHover = true,
}) => {
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [animProgress, setAnimProgress] = useState<{ side: 'left' | 'right' | 'both' | null; progress: number }>({
    side: null,
    progress: 0,
  });
  const animRef = useRef<number | null>(null);

  const { xMin, xMax, yMin, yMax, segments, points, asymptotes = [], horizontalAsymptotes = [] } = spec;

  // Coordinate conversion
  const padding = { top: 25, right: 30, bottom: 35, left: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const toSvgX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toSvgY = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotHeight;
  const fromSvgX = (svgX: number) => xMin + ((svgX - padding.left) / plotWidth) * (xMax - xMin);

  // Trigger limit animations when highlight props change
  useEffect(() => {
    if (pointToEvaluate === undefined) return;

    if (highlightBothLimits) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const startTime = performance.now();
      const duration = 1700; // ms

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimProgress({ side: 'both', progress: eased });

        if (p < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };
      animRef.current = requestAnimationFrame(animate);
    } else if (highlightLeftLimit) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const startTime = performance.now();
      const duration = 1600; // ms

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimProgress({ side: 'left', progress: eased });

        if (p < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };
      animRef.current = requestAnimationFrame(animate);
    } else if (highlightRightLimit) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const startTime = performance.now();
      const duration = 1600;

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimProgress({ side: 'right', progress: eased });

        if (p < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      setAnimProgress({ side: null, progress: 0 });
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [highlightLeftLimit, highlightRightLimit, highlightBothLimits, pointToEvaluate]);

  // Generate SVG path for a curve segment
  const generatePath = (segment: typeof segments[0]) => {
    if (!segment.fn) return '';
    const pointsCount = 200;
    const step = (segment.xMax - segment.xMin) / pointsCount;
    let d = '';
    let isDrawing = false;

    for (let i = 0; i <= pointsCount; i++) {
      const x = segment.xMin + i * step;
      let y: number;
      try {
        y = segment.fn(x);
      } catch {
        isDrawing = false;
        continue;
      }

      if (isNaN(y) || !isFinite(y) || y < yMin - 5 || y > yMax + 5) {
        isDrawing = false;
        continue;
      }

      const sx = toSvgX(x);
      const sy = toSvgY(y);

      if (!isDrawing) {
        d += `M ${sx.toFixed(1)} ${sy.toFixed(1)} `;
        isDrawing = true;
      } else {
        d += `L ${sx.toFixed(1)} ${sy.toFixed(1)} `;
      }
    }
    return d;
  };

  // Find evaluated positions for animated probes
  const getAnimatedPositions = () => {
    if (pointToEvaluate === undefined || !animProgress.side) return [];
    const a = pointToEvaluate;
    const results: { side: 'left' | 'right'; x: number; y: number; sx: number; sy: number }[] = [];

    if (animProgress.side === 'left' || animProgress.side === 'both') {
      const startX = Math.max(xMin, a - 2.8);
      const curX = startX + (a - startX) * animProgress.progress * 0.985;
      const segment = segments.find(s => curX >= s.xMin - 0.05 && curX <= s.xMax + 0.05 && s.fn);
      if (segment && segment.fn) {
        try {
          const curY = segment.fn(curX);
          if (!isNaN(curY) && isFinite(curY)) {
            results.push({ side: 'left', x: curX, y: curY, sx: toSvgX(curX), sy: toSvgY(curY) });
          }
        } catch {}
      }
    }

    if (animProgress.side === 'right' || animProgress.side === 'both') {
      const startX = Math.min(xMax, a + 2.8);
      const curX = startX - (startX - a) * animProgress.progress * 0.985;
      const segment = segments.find(s => curX >= s.xMin - 0.05 && curX <= s.xMax + 0.05 && s.fn);
      if (segment && segment.fn) {
        try {
          const curY = segment.fn(curX);
          if (!isNaN(curY) && isFinite(curY)) {
            results.push({ side: 'right', x: curX, y: curY, sx: toSvgX(curX), sy: toSvgY(curY) });
          }
        } catch {}
      }
    }

    return results;
  };

  const animPositions = getAnimatedPositions();

  // Dynamic contrast-first limit animation colors that strictly DO NOT collide with the curve colors
  // (e.g. if the graph segment is green, never use green; if blue, never use blue)
  const { leftLimitColor, rightLimitColor } = React.useMemo(() => {
    const isGreenish = (c?: string) => {
      if (!c) return false;
      const lower = c.toLowerCase();
      return (
        lower.includes('10b981') ||
        lower.includes('059669') ||
        lower.includes('16a34a') ||
        lower.includes('22c55e') ||
        lower.includes('84cc16') ||
        lower.includes('green') ||
        lower.includes('emerald') ||
        lower.includes('lime') ||
        lower.includes('teal')
      );
    };

    const isBlueish = (c?: string) => {
      if (!c) return false;
      const lower = c.toLowerCase();
      return (
        lower.includes('3b82f6') ||
        lower.includes('0284c7') ||
        lower.includes('2563eb') ||
        lower.includes('38bdf8') ||
        lower.includes('0ea5e9') ||
        lower.includes('06b6d4') ||
        lower.includes('blue') ||
        lower.includes('sky') ||
        lower.includes('cyan')
      );
    };

    const isOrangish = (c?: string) => {
      if (!c) return false;
      const lower = c.toLowerCase();
      return (
        lower.includes('f59e0b') ||
        lower.includes('d97706') ||
        lower.includes('f97316') ||
        lower.includes('ea580c') ||
        lower.includes('orange') ||
        lower.includes('amber')
      );
    };

    const isPurplish = (c?: string) => {
      if (!c) return false;
      const lower = c.toLowerCase();
      return (
        lower.includes('8b5cf6') ||
        lower.includes('a855f7') ||
        lower.includes('7c3aed') ||
        lower.includes('9333ea') ||
        lower.includes('purple') ||
        lower.includes('violet') ||
        lower.includes('fuchsia')
      );
    };

    const isReddish = (c?: string) => {
      if (!c) return false;
      const lower = c.toLowerCase();
      return (
        lower.includes('ef4444') ||
        lower.includes('dc2626') ||
        lower.includes('f43f5e') ||
        lower.includes('e11d48') ||
        lower.includes('red') ||
        lower.includes('rose')
      );
    };

    // Find the segments near the evaluated point
    const leftSeg =
      pointToEvaluate !== undefined
        ? segments.find(s => s.xMin < pointToEvaluate && s.xMax <= pointToEvaluate + 0.1) || segments[0]
        : segments[0];

    const rightSeg =
      pointToEvaluate !== undefined
        ? segments.find(s => s.xMax > pointToEvaluate && s.xMin >= pointToEvaluate - 0.1) || segments[segments.length - 1]
        : segments[segments.length - 1];

    const leftCurveColor = leftSeg?.color;
    const rightCurveColor = rightSeg?.color;

    // Pick Left Color (never green, never blue if the curve is blue/green):
    // Default: Radiant vivid Orange-600 (#EA580C)
    let left = '#EA580C';
    if (isOrangish(leftCurveColor)) {
      left = '#9333EA'; // Violet/Purple
    } else if (isReddish(leftCurveColor)) {
      left = '#EAB308'; // Bright Gold
    }

    // Pick Right Color (never green, never blue if the curve is blue/green):
    // Default: Vibrant Violet / Purple (#9333EA)
    let right = '#9333EA';
    if (isPurplish(rightCurveColor)) {
      right = '#E11D48'; // Bright Rose/Crimson
    } else if (isReddish(rightCurveColor)) {
      right = '#06B6D4'; // Bright Cyan
    }

    // Ensure Left and Right do not collide with each other
    if (left === right) {
      if (left === '#9333EA') left = '#EA580C';
      else right = '#9333EA';
    }

    // STRICT COLLISION PREVENTION WITH GRAPH CURVES:
    // If the left curve is green, left animation MUST NOT be green!
    if (isGreenish(leftCurveColor) && isGreenish(left)) {
      left = '#EA580C';
    }
    // If the right curve is green, right animation MUST NOT be green!
    if (isGreenish(rightCurveColor) && isGreenish(right)) {
      right = '#9333EA';
    }
    // If the left curve is blue, left animation MUST NOT be blue!
    if (isBlueish(leftCurveColor) && isBlueish(left)) {
      left = '#EA580C';
    }
    // If the right curve is blue, right animation MUST NOT be blue!
    if (isBlueish(rightCurveColor) && isBlueish(right)) {
      right = '#9333EA';
    }

    return { leftLimitColor: left, rightLimitColor: right };
  }, [segments, pointToEvaluate]);

  // Grid lines & colors
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';
  const axisColor = isDarkMode ? '#94A3B8' : '#475569';
  const textColor = isDarkMode ? '#CBD5E1' : '#64748B';
  const defaultCurveColor = isDarkMode ? '#38BDF8' : '#0284C7';
  const pointBgColor = isDarkMode ? '#0F172A' : '#FFFFFF';

  // Tick generator
  const xTicks: number[] = [];
  const xStep = spec.xStep || 1;
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += xStep) {
    if (x !== 0) xTicks.push(x);
  }

  const yTicks: number[] = [];
  const yStep = spec.yStep || 1;
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep) {
    if (y !== 0) yTicks.push(y);
  }

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showCoordinatesHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    const svgY = ((e.clientY - rect.top) / rect.height) * height;

    if (
      svgX >= padding.left &&
      svgX <= width - padding.right &&
      svgY >= padding.top &&
      svgY <= height - padding.bottom
    ) {
      const mathX = fromSvgX(svgX);
      const seg = segments.find(s => mathX >= s.xMin && mathX <= s.xMax && s.fn);
      if (seg && seg.fn) {
        try {
          const valY = seg.fn(mathX);
          if (isFinite(valY)) {
            setHoverCoord({ x: mathX, y: valY });
          } else {
            setHoverCoord(null);
          }
        } catch {
          setHoverCoord(null);
        }
      } else {
        setHoverCoord(null);
      }

      if (onInteractiveXChange) {
        onInteractiveXChange(mathX);
      }
    } else {
      setHoverCoord(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const showLeftArrow =
    pointToEvaluate !== undefined && (highlightLeftLimit || highlightBothLimits || animProgress.side === 'both');
  const showRightArrow =
    pointToEvaluate !== undefined && (highlightRightLimit || highlightBothLimits || animProgress.side === 'both');

  return (
    <div className="relative w-full max-w-full overflow-hidden flex flex-col items-center select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[420px] transition-all duration-150"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background definition */}
        <rect
          x={padding.left}
          y={padding.top}
          width={plotWidth}
          height={plotHeight}
          fill={isDarkMode ? '#090D16' : '#FAFAFC'}
          rx="6"
        />

        {/* Clip path for plot area */}
        <defs>
          <clipPath id={`plot-clip-${spec.xMin}-${spec.xMax}-${pointToEvaluate ?? 'none'}`}>
            <rect x={padding.left} y={padding.top} width={plotWidth} height={plotHeight} />
          </clipPath>
          <marker
            id="arrow-axis"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={axisColor} />
          </marker>
        </defs>

        {/* Grid lines X */}
        {xTicks.map(x => (
          <line
            key={`grid-x-${x}`}
            x1={toSvgX(x)}
            y1={padding.top}
            x2={toSvgX(x)}
            y2={height - padding.bottom}
            stroke={gridColor}
            strokeWidth="1"
            strokeDasharray={x % 2 === 0 ? undefined : '2,2'}
          />
        ))}

        {/* Grid lines Y */}
        {yTicks.map(y => (
          <line
            key={`grid-y-${y}`}
            x1={padding.left}
            y1={toSvgY(y)}
            x2={width - padding.right}
            y2={toSvgY(y)}
            stroke={gridColor}
            strokeWidth="1"
            strokeDasharray={y % 2 === 0 ? undefined : '2,2'}
          />
        ))}

        {/* Axes */}
        {/* X Axis */}
        <line
          x1={padding.left - 5}
          y1={originY}
          x2={width - padding.right + 12}
          y2={originY}
          stroke={axisColor}
          strokeWidth="1.5"
          markerEnd="url(#arrow-axis)"
        />
        {/* Y Axis */}
        <line
          x1={originX}
          y1={height - padding.bottom + 5}
          x2={originX}
          y2={padding.top - 12}
          stroke={axisColor}
          strokeWidth="1.5"
          markerEnd="url(#arrow-axis)"
        />

        {/* Axis Labels */}
        <text
          x={width - padding.right + 18}
          y={originY + 4}
          fill={axisColor}
          fontSize="12"
          fontStyle="italic"
          fontWeight="600"
          fontFamily="system-ui"
        >
          x
        </text>
        <text
          x={originX - 4}
          y={padding.top - 16}
          fill={axisColor}
          fontSize="12"
          fontStyle="italic"
          fontWeight="600"
          textAnchor="middle"
          fontFamily="system-ui"
        >
          y
        </text>

        {/* Tick labels X */}
        {xTicks.map(x => (
          <g key={`tick-x-${x}`}>
            <line
              x1={toSvgX(x)}
              y1={originY - 3}
              x2={toSvgX(x)}
              y2={originY + 3}
              stroke={axisColor}
              strokeWidth="1.2"
            />
            <text
              x={toSvgX(x)}
              y={originY + 16}
              fill={textColor}
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {x}
            </text>
          </g>
        ))}

        {/* Tick labels Y */}
        {yTicks.map(y => (
          <g key={`tick-y-${y}`}>
            <line
              x1={originX - 3}
              y1={toSvgY(y)}
              x2={originX + 3}
              y2={toSvgY(y)}
              stroke={axisColor}
              strokeWidth="1.2"
            />
            <text
              x={originX - 8}
              y={toSvgY(y) + 3}
              fill={textColor}
              fontSize="10"
              fontFamily="monospace"
              textAnchor="end"
            >
              {y}
            </text>
          </g>
        ))}

        {/* Origin label */}
        <text
          x={originX - 8}
          y={originY + 14}
          fill={textColor}
          fontSize="10"
          fontFamily="monospace"
          textAnchor="end"
        >
          0
        </text>

        {/* Plot Content (Curves, Asymptotes, Points) wrapped in clip-path */}
        <g clipPath={`url(#plot-clip-${spec.xMin}-${spec.xMax}-${pointToEvaluate ?? 'none'})`}>
          {/* Asymptotes */}
          {asymptotes.map(asympX => (
            <g key={`asymp-${asympX}`}>
              <line
                x1={toSvgX(asympX)}
                y1={padding.top}
                x2={toSvgX(asympX)}
                y2={height - padding.bottom}
                stroke="#EF4444"
                strokeWidth="1.75"
                strokeDasharray="5,4"
              />
              <text
                x={toSvgX(asympX) + 6}
                y={padding.top + 16}
                fill="#EF4444"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                x = {asympX}
              </text>
            </g>
          ))}

          {horizontalAsymptotes.map(asympY => (
            <g key={`hasymp-${asympY}`}>
              <line
                x1={padding.left}
                y1={toSvgY(asympY)}
                x2={width - padding.right}
                y2={toSvgY(asympY)}
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left + 8}
                y={toSvgY(asympY) - 4}
                fill="#F59E0B"
                fontSize="10"
                fontFamily="monospace"
              >
                y = {asympY}
              </text>
            </g>
          ))}

          {/* Curves */}
          {segments.map((seg, idx) => {
            const pathData = generatePath(seg);
            if (!pathData) return null;
            return (
              <path
                key={`curve-${idx}`}
                d={pathData}
                fill="none"
                stroke={seg.color || defaultCurveColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={seg.dashed ? '4,4' : undefined}
              />
            );
          })}

          {/* Critical line x = a indicator if provided */}
          {pointToEvaluate !== undefined && (
            <g>
              <line
                x1={toSvgX(pointToEvaluate)}
                y1={padding.top}
                x2={toSvgX(pointToEvaluate)}
                y2={height - padding.bottom}
                stroke={isDarkMode ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.3)'}
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <rect
                x={toSvgX(pointToEvaluate) - 18}
                y={height - padding.bottom - 18}
                width="36"
                height="16"
                rx="4"
                fill={isDarkMode ? '#581C87' : '#EDE9FE'}
              />
              <text
                x={toSvgX(pointToEvaluate)}
                y={height - padding.bottom - 6}
                fill={isDarkMode ? '#E9D5FF' : '#6B21A8'}
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                x={pointToEvaluate}
              </text>
            </g>
          )}

          {/* Left limit approach arrow */}
          {showLeftArrow && pointToEvaluate !== undefined && (
            <g>
              <line
                x1={toSvgX(pointToEvaluate - 1.8)}
                y1={height - padding.bottom + 12}
                x2={toSvgX(pointToEvaluate - 0.2)}
                y2={height - padding.bottom + 12}
                stroke={leftLimitColor}
                strokeWidth="3"
              />
              <polygon
                points={`${toSvgX(pointToEvaluate - 0.2)},${height - padding.bottom + 8} ${toSvgX(pointToEvaluate + 0.1)},${height - padding.bottom + 12} ${toSvgX(pointToEvaluate - 0.2)},${height - padding.bottom + 16}`}
                fill={leftLimitColor}
              />
            </g>
          )}

          {/* Right limit approach arrow */}
          {showRightArrow && pointToEvaluate !== undefined && (
            <g>
              <line
                x1={toSvgX(pointToEvaluate + 1.8)}
                y1={height - padding.bottom + 12}
                x2={toSvgX(pointToEvaluate + 0.2)}
                y2={height - padding.bottom + 12}
                stroke={rightLimitColor}
                strokeWidth="3"
              />
              <polygon
                points={`${toSvgX(pointToEvaluate + 0.2)},${height - padding.bottom + 8} ${toSvgX(pointToEvaluate - 0.1)},${height - padding.bottom + 12} ${toSvgX(pointToEvaluate + 0.2)},${height - padding.bottom + 16}`}
                fill={rightLimitColor}
              />
            </g>
          )}

          {/* Animated Limit Tracer Probes */}
          {animPositions.map(pos => {
            const probeColor = pos.side === 'left' ? leftLimitColor : rightLimitColor;
            return (
              <g key={`anim-probe-${pos.side}`}>
                {/* Vertical projection line */}
                <line
                  x1={pos.sx}
                  y1={pos.sy}
                  x2={pos.sx}
                  y2={originY}
                  stroke={probeColor}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                {/* Horizontal projection line */}
                <line
                  x1={pos.sx}
                  y1={pos.sy}
                  x2={originX}
                  y2={pos.sy}
                  stroke={probeColor}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                {/* Glowing halo around probe for maximum visibility */}
                <circle
                  cx={pos.sx}
                  cy={pos.sy}
                  r="12"
                  fill={probeColor}
                  opacity="0.3"
                />
                {/* Animated Probe Dot */}
                <circle
                  cx={pos.sx}
                  cy={pos.sy}
                  r="7.5"
                  fill={probeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                {/* Live coordinates chip */}
                <g
                  transform={`translate(${Math.min(
                    width - 90,
                    Math.max(10, pos.side === 'left' ? pos.sx - 65 : pos.sx + 5)
                  )}, ${Math.max(15, pos.sy - 30)})`}
                >
                  <rect
                    x="0"
                    y="0"
                    width="66"
                    height="20"
                    rx="4"
                    fill={isDarkMode ? '#1E293B' : '#0F172A'}
                    stroke={probeColor}
                    strokeWidth="1.5"
                  />
                  <text
                    x="33"
                    y="13"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    ({pos.x.toFixed(2)}, {pos.y.toFixed(2)})
                  </text>
                </g>
              </g>
            );
          })}

          {/* Discrete points (hollow & filled circles) */}
          {points.map((pt, idx) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);
            const ptColor = pt.color || defaultCurveColor;

            if (pt.type === 'hollow') {
              return (
                <g key={`point-${idx}`}>
                  <circle
                    cx={sx}
                    cy={sy}
                    r="5.5"
                    fill={pointBgColor}
                    stroke={ptColor}
                    strokeWidth="2.5"
                  />
                  {pt.label && (
                    <text
                      x={sx + 8}
                      y={sy - 6}
                      fill={textColor}
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              );
            }

            return (
              <g key={`point-${idx}`}>
                <circle
                  cx={sx}
                  cy={sy}
                  r="5.5"
                  fill={ptColor}
                  stroke={isDarkMode ? '#0F172A' : '#FFFFFF'}
                  strokeWidth="1.5"
                />
                {pt.label && (
                  <text
                    x={sx + 8}
                    y={sy - 6}
                    fill={textColor}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive cursor if provided */}
          {interactiveX !== null && (
            <line
              x1={toSvgX(interactiveX)}
              y1={padding.top}
              x2={toSvgX(interactiveX)}
              y2={height - padding.bottom}
              stroke="#E11D48"
              strokeWidth="1.5"
              strokeDasharray="2,2"
            />
          )}
        </g>
      </svg>

      {/* Legend / Info bar under graph (Correct mathematical labels without unrendered LaTeX symbols) */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-sky-500 bg-white dark:bg-slate-900" />
          <span>Punto hueco (no definido en la curva)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-sky-500" />
          <span>Punto relleno (valor puntual definido)</span>
        </span>
        {asymptotes.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-0.5 border-t-2 border-dashed border-red-500" />
            <span>Asíntota vertical (x = {asymptotes.join(', ')})</span>
          </span>
        )}
        {hoverCoord && (
          <span className="font-mono text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Cursor: x={hoverCoord.x.toFixed(2)}, y={hoverCoord.y.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};
