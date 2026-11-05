import React from 'react';
import { BookOpen } from 'lucide-react';

export default function TheoryPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-600" />
        Alpha-Beta Theory
      </h2>
      <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
        <p>
          <strong className="text-slate-800">Alpha (α):</strong> Best choice found so far for <span className="text-blue-600 font-bold">MAX</span> (initial: -∞).
        </p>
        <p>
          <strong className="text-slate-800">Beta (β):</strong> Best choice found so far for <span className="text-amber-600 font-bold">MIN</span> (initial: +∞).
        </p>
        <p className="bg-amber-50 p-2 rounded border border-amber-200 font-medium text-amber-900">
          <strong>Cut-off Rule:</strong> When β ≤ α, remaining subtrees are pruned.
        </p>
      </div>
    </div>
  );
}