export const MAX_NODE = 'MAX';
export const MIN_NODE = 'MIN';

export const createInitialTree = (depth, branchingFactor, minValue = -10, maxValue = 10, seed = 1, rootType = 'MAX') => {
  let idCounter = 1;
  const pseudoRandom = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  let currentSeed = seed;
  const getRandomValue = () => {
    currentSeed += 1;
    const r = pseudoRandom(currentSeed);
    return Math.floor(r * (maxValue - minValue + 1)) + minValue;
  };

  const buildNode = (currentDepth, nodeType, indexInParent = 0) => {
    const nodeId = `node_${idCounter++}`;
    if (currentDepth === depth) {
      let leafVal = getRandomValue();
      if (indexInParent > 0 && indexInParent % 2 === 1) {
        leafVal = nodeType === MAX_NODE ? -99 : 99;
      }
      return {
        id: nodeId,
        type: nodeType,
        value: leafVal,
        depth: currentDepth,
        children: [],
        alpha: -Infinity,
        beta: Infinity,
        status: 'UNVISITED'
      };
    }

    const children = [];
    const nextType = nodeType === MAX_NODE ? MIN_NODE : MAX_NODE;
    for (let i = 0; i < branchingFactor; i++) {
      children.push(buildNode(currentDepth + 1, nextType, i));
    }

    return {
      id: nodeId,
      type: nodeType,
      value: null,
      depth: currentDepth,
      children,
      alpha: -Infinity,
      beta: Infinity,
      status: 'UNVISITED'
    };
  };

  return buildNode(0, rootType, 0);
};

export const calculateLayout = (root, width = 1200, height = 550) => {
  const nodeCoords = {};
  let leafIndex = 0;

  const countLeaves = (node) => {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((acc, c) => acc + countLeaves(c), 0);
  };

  const totalLeaves = countLeaves(root);
  const getDepth = (node) => {
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getDepth));
  };
  const maxDepth = getDepth(root);
  const levelHeight = (height - 120) / Math.max(1, maxDepth - 1);
  const dynamicWidth = Math.max(width, totalLeaves * 45);

  const positionNode = (node, depthLevel = 0) => {
    const y = 60 + depthLevel * levelHeight;
    let x = 0;

    if (!node.children || node.children.length === 0) {
      x = (leafIndex + 0.5) * (dynamicWidth / totalLeaves);
      leafIndex++;
    } else {
      const childXs = node.children.map(c => positionNode(c, depthLevel + 1).x);
      x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    }

    const pos = { x, y, id: node.id, type: node.type };
    nodeCoords[node.id] = pos;
    return pos;
  };

  positionNode(root, 0);
  return { nodeCoords, dynamicWidth };
};