import React from 'react';
import type { CompoundFigure, FigureLayer, ShapeType, FillType, LayerPosition, LayerSize } from '../../lib/types';

// ── Position map: named positions → pixel coords in 100×100 viewBox ──

const POSITION_MAP: Record<LayerPosition, { cx: number; cy: number }> = {
  'center':       { cx: 50, cy: 50 },
  'top':          { cx: 50, cy: 25 },
  'bottom':       { cx: 50, cy: 75 },
  'left':         { cx: 25, cy: 50 },
  'right':        { cx: 75, cy: 50 },
  'top-left':     { cx: 30, cy: 30 },
  'top-right':    { cx: 70, cy: 30 },
  'bottom-left':  { cx: 30, cy: 70 },
  'bottom-right': { cx: 70, cy: 70 },
};

const SIZE_MAP: Record<LayerSize, number> = {
  'xs':     12,
  'small':  20,
  'medium': 32,
  'large':  44,
  'xl':     52,
};

// ── Pattern generation ───────────────────────────────────────────────

function getPatternId(fill: FillType, uid: string, layerIdx: number): string {
  return `cf-pat-${fill}-${uid}-${layerIdx}`;
}

function renderPattern(fill: FillType, uid: string, layerIdx: number): React.ReactNode {
  const id = getPatternId(fill, uid, layerIdx);
  switch (fill) {
    case 'striped-horizontal':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="white" />
          <line x1="0" y1="2" x2="8" y2="2" stroke="black" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="8" y2="6" stroke="black" strokeWidth="1.5" />
        </pattern>
      );
    case 'striped-vertical':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="white" />
          <line x1="2" y1="0" x2="2" y2="8" stroke="black" strokeWidth="1.5" />
          <line x1="6" y1="0" x2="6" y2="8" stroke="black" strokeWidth="1.5" />
        </pattern>
      );
    case 'striped-diagonal':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="white" />
          <line x1="0" y1="8" x2="8" y2="0" stroke="black" strokeWidth="1.5" />
        </pattern>
      );
    case 'dotted':
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="white" />
          <circle cx="4" cy="4" r="1.5" fill="black" />
        </pattern>
      );
    default:
      return null;
  }
}

function getFillColor(fill: FillType, uid: string, layerIdx: number): string {
  switch (fill) {
    case 'solid': return 'black';
    case 'empty': return 'white';
    case 'gray': return '#999';
    case 'striped-horizontal':
    case 'striped-vertical':
    case 'striped-diagonal':
    case 'dotted':
      return `url(#${getPatternId(fill, uid, layerIdx)})`;
    default: return 'white';
  }
}

function needsPattern(fill: FillType): boolean {
  return ['striped-horizontal', 'striped-vertical', 'striped-diagonal', 'dotted'].includes(fill);
}

// ── Shape path generation (extended from ShapeRenderer) ──────────────

function getShapePath(shapeType: ShapeType, s: number): string {
  const h = s / 2;
  switch (shapeType) {
    case 'circle':
      return ''; // handled separately as <circle>
    case 'triangle':
      return `M 0 ${-h} L ${h} ${h} L ${-h} ${h} Z`;
    case 'square':
      return `M ${-h} ${-h} L ${h} ${-h} L ${h} ${h} L ${-h} ${h} Z`;
    case 'rectangle':
      return `M ${-h} ${-h * 0.6} L ${h} ${-h * 0.6} L ${h} ${h * 0.6} L ${-h} ${h * 0.6} Z`;
    case 'parallelogram':
      return `M ${-h + h * 0.3} ${-h * 0.6} L ${h} ${-h * 0.6} L ${h - h * 0.3} ${h * 0.6} L ${-h} ${h * 0.6} Z`;
    case 'semicircle': {
      return `M ${-h} 0 A ${h} ${h} 0 0 1 ${h} 0 Z`;
    }
    case 'oval':
      return `M ${-h} 0 A ${h} ${h * 0.6} 0 1 1 ${h} 0 A ${h} ${h * 0.6} 0 1 1 ${-h} 0 Z`;
    case 'pentagon': {
      const pts = Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        return `${h * Math.cos(angle)},${h * Math.sin(angle)}`;
      });
      return `M ${pts.join(' L ')} Z`;
    }
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        return `${h * Math.cos(angle)},${h * Math.sin(angle)}`;
      });
      return `M ${pts.join(' L ')} Z`;
    }
    case 'star': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? h : h * 0.4;
        const angle = (i * 36 - 90) * Math.PI / 180;
        return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
      });
      return `M ${pts.join(' L ')} Z`;
    }
    case 'arrow':
      return `M 0 ${-h} L ${h * 0.6} ${-h * 0.1} L ${h * 0.3} ${-h * 0.1} L ${h * 0.3} ${h} L ${-h * 0.3} ${h} L ${-h * 0.3} ${-h * 0.1} L ${-h * 0.6} ${-h * 0.1} Z`;
    case 'cross':
      return `M ${-h * 0.3} ${-h} L ${h * 0.3} ${-h} L ${h * 0.3} ${-h * 0.3} L ${h} ${-h * 0.3} L ${h} ${h * 0.3} L ${h * 0.3} ${h * 0.3} L ${h * 0.3} ${h} L ${-h * 0.3} ${h} L ${-h * 0.3} ${h * 0.3} L ${-h} ${h * 0.3} L ${-h} ${-h * 0.3} L ${-h * 0.3} ${-h * 0.3} Z`;
    case 'diamond':
      return `M 0 ${-h} L ${h} 0 L 0 ${h} L ${-h} 0 Z`;
    default:
      return `M ${-h} ${-h} L ${h} ${-h} L ${h} ${h} L ${-h} ${h} Z`;
  }
}

function getStrokeProps(borderStyle?: string): { strokeWidth: number; strokeDasharray?: string } {
  switch (borderStyle) {
    case 'thick': return { strokeWidth: 3 };
    case 'thin': return { strokeWidth: 1 };
    case 'dashed': return { strokeWidth: 2, strokeDasharray: '6,3' };
    case 'double': return { strokeWidth: 3 };
    default: return { strokeWidth: 2 };
  }
}

// ── Layer renderer ───────────────────────────────────────────────────

function renderLayer(
  layer: FigureLayer,
  uid: string,
  layerIdx: number,
): React.ReactNode {
  const pos = POSITION_MAP[layer.position] || POSITION_MAP.center;
  const s = SIZE_MAP[layer.size] || SIZE_MAP.medium;
  const fillColor = getFillColor(layer.fill, uid, layerIdx);
  const rotation = layer.rotation || 0;
  const strokeProps = getStrokeProps(layer.borderStyle);

  return (
    <g key={layerIdx} transform={`translate(${pos.cx}, ${pos.cy}) rotate(${rotation})`}>
      {layer.shape === 'circle' ? (
        <circle
          r={s / 2}
          fill={fillColor}
          stroke="black"
          {...strokeProps}
        />
      ) : (
        <path
          d={getShapePath(layer.shape, s)}
          fill={fillColor}
          stroke="black"
          {...strokeProps}
        />
      )}
    </g>
  );
}

// ── Main compound figure renderer ────────────────────────────────────

interface CompoundFigureRendererProps {
  figure: CompoundFigure;
}

const CompoundFigureRenderer: React.FC<CompoundFigureRendererProps> = ({ figure }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <g>
      <defs>
        {figure.layers.map((layer, i) =>
          needsPattern(layer.fill) ? (
            <React.Fragment key={`pat-${i}`}>
              {renderPattern(layer.fill, uid, i)}
            </React.Fragment>
          ) : null
        )}
      </defs>
      {figure.layers.map((layer, i) => renderLayer(layer, uid, i))}
    </g>
  );
};

export default CompoundFigureRenderer;

// ── Card wrapper (mirrors ShapeCard) ─────────────────────────────────

export function CompoundFigureCard({
  figure,
  size = 120,
  selected,
  onClick,
  label,
  disabled,
}: {
  figure: CompoundFigure;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-bg-hover bg-bg-card hover:border-text-muted'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="bg-white rounded"
      >
        <CompoundFigureRenderer figure={figure} />
      </svg>
      {label && (
        <span className="text-sm font-bold text-text-muted">{label}</span>
      )}
    </button>
  );
}
