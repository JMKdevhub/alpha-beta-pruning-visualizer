import { MAX_NODE } from './treeGenerator';

// Safe recursive tree cloning helper to completely avoid CSP eval warnings
const cloneTree = (node) => {
  if (!node) return null;
  return {
    id: node.id,
    type: node.type,
    value: node.value,
    depth: node.depth,
    alpha: node.alpha,
    beta: node.beta,
    status: node.status,
    children: node.children ? node.children.map(cloneTree) : []
  };
};

export const generateExecutionSteps = (rootNode) => {
  const steps = [];
  const treeCopy = cloneTree(rootNode);
  let alphaBetaNodesEvaluated = 0;
  let prunedNodesCount = 0;
  const stack = [];

  const recordStep = (currentNode, action, message) => {
    steps.push({
      stepId: steps.length + 1,
      nodeId: currentNode.id,
      treeState: cloneTree(treeCopy),
      action,
      message,
      stack: stack.map(item => ({ ...item })),
      alphaBetaEvaluated: alphaBetaNodesEvaluated,
      prunedCount: prunedNodesCount
    });
  };

  const findNode = (n, id) => {
    if (n.id === id) return n;
    for (const child of n.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const markSubtreePruned = (n) => {
    n.status = 'PRUNED';
    prunedNodesCount++;
    if (n.children) {
      n.children.forEach(markSubtreePruned);
    }
  };

  const alphaBeta = (nodeId, alpha, beta) => {
    const node = findNode(treeCopy, nodeId);
    node.status = 'EVALUATING';
    node.alpha = alpha;
    node.beta = beta;
    alphaBetaNodesEvaluated++;
    stack.push({ id: node.id, type: node.type, depth: node.depth });

    const aDisp = alpha === -Infinity ? '-∞' : alpha;
    const bDisp = beta === Infinity ? '∞' : beta;
    recordStep(node, 'ENTER', `Entered ${node.type} node (${node.id}) with [α: ${aDisp}, β: ${bDisp}]`);

    if (!node.children || node.children.length === 0) {
      node.status = 'VISITED';
      recordStep(node, 'LEAF_EVAL', `Evaluated leaf node ${node.id} with terminal score ${node.value}`);
      stack.pop();
      return node.value;
    }

    if (node.type === MAX_NODE) {
      let value = -Infinity;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        recordStep(node, 'VISIT_CHILD', `MAX node ${node.id} descending to child ${child.id}`);
        const childVal = alphaBeta(child.id, alpha, beta);

        if (childVal > value) {
          value = childVal;
          node.value = value;
        }
        if (value > alpha) {
          alpha = value;
          node.alpha = alpha;
        }

        recordStep(node, 'UPDATE_BOUNDS', `MAX node ${node.id} updated value to ${value}`);

        if (beta <= alpha) {
          const bCut = beta === Infinity ? '∞' : beta;
          recordStep(node, 'PRUNE_TRIGGER', `Cut-off at MAX node ${node.id}: β (${bCut}) ≤ α (${alpha}). Pruning remaining subtrees.`);
          for (let j = i + 1; j < node.children.length; j++) {
            markSubtreePruned(node.children[j]);
          }
          break;
        }
      }
      node.status = 'VISITED';
      recordStep(node, 'BACKTRACK', `MAX node ${node.id} finalized value ${node.value}`);
      stack.pop();
      return value;
    } else {
      let value = Infinity;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        recordStep(node, 'VISIT_CHILD', `MIN node ${node.id} descending to child ${child.id}`);
        const childVal = alphaBeta(child.id, alpha, beta);

        if (childVal < value) {
          value = childVal;
          node.value = value;
        }
        if (value < beta) {
          beta = value;
          node.beta = beta;
        }

        recordStep(node, 'UPDATE_BOUNDS', `MIN node ${node.id} updated value to ${value}`);

        if (beta <= alpha) {
          const aCut = alpha === -Infinity ? '-∞' : alpha;
          recordStep(node, 'PRUNE_TRIGGER', `Cut-off at MIN node ${node.id}: β (${beta}) ≤ α (${aCut}). Pruning remaining subtrees.`);
          for (let j = i + 1; j < node.children.length; j++) {
            markSubtreePruned(node.children[j]);
          }
          break;
        }
      }
      node.status = 'VISITED';
      recordStep(node, 'BACKTRACK', `MIN node ${node.id} finalized value ${node.value}`);
      stack.pop();
      return value;
    }
  };

  alphaBeta(treeCopy.id, -Infinity, Infinity);
  return { steps, alphaBetaNodesEvaluated, optimalValue: treeCopy.value };
};