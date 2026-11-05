import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

const MAX_NODE = 'MAX';

export default function TreeVisualizer({
  currentTreeState,
  layout,
  dynamicWidth,
  currentStepIndex,
  executionData,
  currentStep,
  handleReset,
  handleStepBack,
  isPlaying,
  setIsPlaying,
  handleStepForward,
  speed,
  setSpeed
}) {
  const [zoom, setZoom] = useState(1.0);

  const toggleFullscreen = () => {
    const el = document.getElementById('canvasWrapper');
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const renderTreeEdges = (node) => {
    if (!node.children || node.children.length === 0) return null;
    const parentPos = layout[node.id];
    if (!parentPos) return null;

    return node.children.map(child => {
      const childPos = layout[child.id];
      if (!childPos) return null;

      const isPruned = child.status === 'PRUNED';
      let strokeColor = isPruned ? '#EF4444' : (child.status === 'VISITED' || child.status === 'EVALUATING' ? '#2563EB' : '#CBD5E1');
      let strokeWidth = isPruned ? 1.5 : (child.status === 'VISITED' || child.status === 'EVALUATING' ? 2.5 : 2);

      return (
        <g key={`edge_${node.id}_${child.id}`}>
          <line
            x1={parentPos.x}
            y1={parentPos.y}
            x2={childPos.x}
            y2={childPos.y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isPruned ? '4 4' : '0'}
          />
          {isPruned && (
            <line
              x1={(parentPos.x + childPos.x) / 2 - 8}
              y1={(parentPos.y + childPos.y) / 2 - 8}
              x2={(parentPos.x + childPos.x) / 2 + 8}
              y2={(parentPos.y + childPos.y) / 2 + 8}
              stroke="#EF4444"
              strokeWidth={3}
            />
          )}
          {renderTreeEdges(child)}
        </g>
      );
    });
  };

  const renderTreeNodes = (node) => {
    const pos = layout[node.id];
    if (!pos) return null;

    const isCurrent = currentStep?.nodeId === node.id;
    const isPruned = node.status === 'PRUNED';
    const isVisited = node.status === 'VISITED';
    const isEvaluating = node.status === 'EVALUATING';
    const isLeaf = !node.children || node.children.length === 0;

    let fill = '#FFFFFF';
    let stroke = '#64748B';
    let strokeWidth = 2;

    if (isCurrent) {
      stroke = '#3B82F6';
      fill = '#EFF6FF';
      strokeWidth = 4;
    } else if (isPruned) {
      fill = '#FEF2F2';
      stroke = '#F87171';
    } else if (isVisited) {
      fill = '#F0FDF4';
      stroke = '#22C55E';
    } else if (isEvaluating) {
      fill = '#FEF9C3';
      stroke = '#EAB308';
    }

    const alphaStr = node.alpha === -Infinity ? '-∞' : node.alpha;
    const betaStr = node.beta === Infinity ? '∞' : node.beta;

    return (
      <g key={`node_${node.id}`}>
        {node.type === MAX_NODE ? (
          <polygon
            points={`${pos.x},${pos.y - 22} ${pos.x - 22},${pos.y + 16} ${pos.x + 22},${pos.y + 16}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        ) : (
          <polygon
            points={`${pos.x - 22},${pos.y - 16} ${pos.x + 22},${pos.y - 16} ${pos.x},${pos.y + 22}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        )}

        {node.value !== null && (
          <text
            x={pos.x}
            y={node.type === MAX_NODE ? pos.y + 4 : pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold fill-slate-900 pointer-events-none select-none"
          >
            {node.value}
          </text>
        )}

        {!isLeaf && (
          <text
            x={pos.x}
            y={node.type === MAX_NODE ? pos.y + 36 : pos.y - 28}
            textAnchor="middle"
            className="text-[13px] font-bold font-mono fill-slate-800 select-none tracking-tight"
          >
            [α:{alphaStr}, β:{betaStr}]
          </text>
        )}

        {node.children && node.children.map(renderTreeNodes)}
      </g>
    );
  };

  return (
    <div className="lg:col-span-3 flex flex-col gap-4">
      <div id="canvasWrapper" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 border-2 border-blue-600 bg-blue-50 inline-block"></span> MAX
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium ml-2">
              <span className="w-2.5 h-2.5 border-2 border-amber-600 bg-amber-50 inline-block"></span> MIN
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium ml-2">
              <span className="w-2.5 h-2.5 border-2 border-red-500 bg-red-50 inline-block"></span> Pruned
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>

            <button onClick={handleReset} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleStepBack} disabled={currentStepIndex === 0} className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded border border-slate-200">
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs flex items-center gap-1 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Start'}
            </button>

            <button onClick={handleStepForward} disabled={currentStepIndex >= executionData.steps.length - 1} className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded border border-slate-200">
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
              <span className="text-[11px] text-slate-500">Speed:</span>
              <input
                type="range"
                min="100"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-16 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full overflow-auto flex items-center justify-center p-2 min-h-[440px] bg-slate-50/50 rounded-lg border border-slate-100 my-2">
          {currentTreeState && (
            <svg
              viewBox={`0 0 ${dynamicWidth || 1200} 550`}
              className="w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              {renderTreeEdges(currentTreeState)}
              {renderTreeNodes(currentTreeState)}
            </svg>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Step {currentStepIndex + 1}/{executionData.steps.length}:</span>
            <span className="text-slate-600">{currentStep?.message}</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Evaluated: {currentStep?.alphaBetaEvaluated || 0} | Cut-offs: {currentStep?.prunedCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
}