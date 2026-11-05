import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createInitialTree, calculateLayout } from './Core_algorithm/treeGenerator.js';
import { generateExecutionSteps } from './Core_algorithm/alphaBetaEngine.js';
import TreeVisualizer from './Visualisation/TreeVisualizer.jsx';
import Controls from './UI/Controls.jsx';
import TheoryPanel from './Theory_and_logic/TheoryPanel.jsx';
import './index.css';

export default function App() {
  const [depth, setDepth] = useState(3);
  const [branchingFactor, setBranchingFactor] = useState(2);
  const [rootType, setRootType] = useState('MAX');
  const [seed, setSeed] = useState(42);

  const [tree, setTree] = useState(null);
  const [executionData, setExecutionData] = useState({ steps: [], alphaBetaNodesEvaluated: 0, optimalValue: 0 });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const timerRef = useRef(null);

  useEffect(() => {
    const newTree = createInitialTree(depth, branchingFactor, -10, 10, seed, rootType);
    setTree(newTree);
    const exec = generateExecutionSteps(newTree);
    setExecutionData(exec);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [depth, branchingFactor, rootType, seed]);

  const currentStep = useMemo(() => {
    if (!executionData.steps.length) return null;
    return executionData.steps[Math.min(currentStepIndex, executionData.steps.length - 1)];
  }, [executionData, currentStepIndex]);

  const currentTreeState = currentStep ? currentStep.treeState : tree;
  const { nodeCoords: layout, dynamicWidth } = useMemo(() => {
    if (!tree) return { nodeCoords: {}, dynamicWidth: 1200 };
    return calculateLayout(tree, 1200, 550);
  }, [tree]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= executionData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1050 - speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, executionData]);

  const handleStepForward = () => {
    if (currentStepIndex < executionData.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-2.5 py-1 rounded-md font-bold text-sm">αβ</div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Alpha-Beta Pruning Visualizer</h1>
            <p className="text-[11px] text-slate-500">Generic Game Tree Workbench</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl w-full mx-auto">
        <div className="lg:col-span-1 space-y-5">
          <Controls
            depth={depth}
            setDepth={setDepth}
            branchingFactor={branchingFactor}
            setBranchingFactor={setBranchingFactor}
            rootType={rootType}
            setRootType={setRootType}
            setSeed={setSeed}
            currentStep={currentStep}
          />
          <TheoryPanel />
        </div>

        <TreeVisualizer
          currentTreeState={currentTreeState}
          layout={layout}
          dynamicWidth={dynamicWidth}
          currentStepIndex={currentStepIndex}
          executionData={executionData}
          currentStep={currentStep}
          handleReset={handleReset}
          handleStepBack={handleStepBack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          handleStepForward={handleStepForward}
          speed={speed}
          setSpeed={setSpeed}
        />
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500">
        Alpha-Beta Pruning Game Tree Visualizer • Clean Workbench
      </footer>
    </div>
  );
}