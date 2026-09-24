import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    if (!math) return '';

    // Fix potential double-escaped commands from JSX string attributes:
    // e.g. \\lim -> \lim, \\in -> \in, \\mathbb -> \mathbb, \\quad -> \quad, \\exists -> \exists
    const cleanedMath = math.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

    try {
      return katex.renderToString(cleanedMath, {
        displayMode: block,
        throwOnError: false,
        output: 'html', // Only generate HTML to avoid unstyled MathML fallback text
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-math ${block ? 'block my-2 overflow-x-auto py-1 text-center' : 'inline-block align-middle'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
