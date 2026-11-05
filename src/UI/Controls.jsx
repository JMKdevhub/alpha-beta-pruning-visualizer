import React from 'react';
import { Sliders, RefreshCw, Layers } from 'lucide-react';

const MAX_NODE = 'MAX';

export default function Controls({
  depth,
  setDepth,
  branchingFactor,
  setBranchingFactor,
  setSeed,
  rootType,
  setRootType,
  currentStep
}) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-500" />
          Tree Controls
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Root Node Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRootType('MAX')}
                className={`py-1.5 px-3 rounded font-bold border transition ${rootType === 'MAX' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                MAX (Maximizing)
              </button>
              <button
                onClick={() => setRootType('MIN')}
                className={`py-1.5 px-3 rounded font-bold border transition ${rootType === 'MIN' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                MIN (Minimizing)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium text-slate-700">
              <span>Tree Depth (Depth)</span>
              <span className="font-bold text-blue-600">{depth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium text-slate-700">
              <span>Branching Factor (b)</span>
              <span className="font-bold text-blue-600">{branchingFactor}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={branchingFactor}
              onChange={(e) => setBranchingFactor(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setSeed(prev => prev + 1)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-md font-semibold flex items-center justify-center gap-1.5 border border-slate-300 transition-all text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Randomize Values
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          Recursion Stack
        </h2>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
          {currentStep?.stack?.length ? (
            currentStep.stack.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs">
                <span className="font-semibold text-slate-700">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === MAX_NODE ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-3">Stack empty</p>
          )}
        </div>
      </div>
    </div>
  );
}
