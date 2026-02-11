import React from 'react';
import type { ShapeConfig, ShapeType, FillType } from '../../lib/types';

interface ShapeRendererProps {
  config: ShapeConfig;
  size?: number;
  cx?: number;
  cy?: number;
}

function getPatternId(fill: FillType, idx: number): string {
  return `pattern-${fill}-${idx}`;
}

function renderPattern(fill: FillType, idx: number): React.ReactNode {
  const id = getPatternId(fill, idx);
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

function getFill(fill: FillType, idx: number): string {
  switch (fill) {
    case 'solid': return 'black';
    case 'empty': return 'white';
    case 'striped-horizontal':
    case 'striped-vertical':
    case 'striped-diagonal':
    case 'dotted':
      return `url(#${getPatternId(fill, idx)})`;
    default: return 'white';
  }
}

function getShapePath(shapeType: ShapeType, s: number): string {
  const h = s / 2;
  switch (shapeType) {
    case 'circle':
      return ''; // handled separately
    case 'triangle':
      return `M 0 ${-h} L ${h} ${h} L ${-h} ${h} Z`;
    case 'square':
      return `M ${-h} ${-h} L ${h} ${-h} L ${h} ${h} L ${-h} ${h} Z`;
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

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  config,
  size: sizeProp,
  cx = 50,
  cy = 50,
}) => {
  const sizeMap = { small: 24, medium: 36, large: 48 };
  const s = sizeProp || sizeMap[config.size || 'medium'];
  const rotation = config.rotation || 0;
  const fillColor = getFill(config.fill, Math.random() * 1000 | 0);
  const strokeProps = getStrokeProps(config.borderStyle);
  const uniqueId = React.useId();

  const renderInnerShape = () => {
    if (!config.innerShape || config.innerShape === 'none') return null;
    const innerSize = s * 0.35;
    if (config.innerShape === 'dot') {
      return <circle cx={0} cy={0} r={innerSize * 0.3} fill="black" />;
    }
    if (config.innerShape === 'circle') {
      return <circle cx={0} cy={0} r={innerSize * 0.5} fill="none" stroke="black" strokeWidth={1.5} />;
    }
    const innerPath = getShapePath(config.innerShape as ShapeType, innerSize);
    return <path d={innerPath} fill="none" stroke="black" strokeWidth={1.5} />;
  };

  const renderCount = () => {
    const count = config.count || 1;
    if (count === 1) return null;
    const elements = [];
    const spacing = s * 0.5;
    for (let i = 1; i < count; i++) {
      const offsetX = i * spacing * 0.4;
      const offsetY = i * spacing * 0.3;
      elements.push(
        <g key={i} transform={`translate(${offsetX}, ${offsetY}) scale(0.6)`}>
          {config.shapeType === 'circle' ? (
            <circle r={s / 2} fill="none" stroke="black" strokeWidth={1.5} />
          ) : (
            <path d={getShapePath(config.shapeType, s)} fill="none" stroke="black" strokeWidth={1.5} />
          )}
        </g>
      );
    }
    return elements;
  };

  const needsPattern = ['striped-horizontal', 'striped-vertical', 'striped-diagonal', 'dotted'].includes(config.fill);
  const patternIdx = parseInt(uniqueId.replace(/[^0-9]/g, '')) || 0;

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation})`}>
      {needsPattern && (
        <defs>{renderPattern(config.fill, patternIdx)}</defs>
      )}
      {config.shapeType === 'circle' ? (
        <circle
          r={s / 2}
          fill={needsPattern ? `url(#${getPatternId(config.fill, patternIdx)})` : fillColor}
          stroke="black"
          {...strokeProps}
        />
      ) : (
        <path
          d={getShapePath(config.shapeType, s)}
          fill={needsPattern ? `url(#${getPatternId(config.fill, patternIdx)})` : fillColor}
          stroke="black"
          {...strokeProps}
        />
      )}
      {renderInnerShape()}
      {renderCount()}
    </g>
  );
};

export default ShapeRenderer;

export function ShapeCard({
  config,
  size = 80,
  selected,
  onClick,
  label,
  disabled,
}: {
  config: ShapeConfig;
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
        <ShapeRenderer config={config} cx={50} cy={50} />
      </svg>
      {label && (
        <span className="text-sm font-bold text-text-muted">{label}</span>
      )}
    </button>
  );
}
