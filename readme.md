# Alpha-Beta Pruning Interactive Visualizer

A web-based interactive educational tool and game tree workbench designed to demonstrate the mechanics of the **Alpha-Beta Pruning** algorithm. Built using React, Tailwind CSS, and Vite.

---

## 🚀 Key Features

- **Configurable Game Trees**: Dynamically adjust tree depth (up to 6) and branching factor (up to 4).
- **Root Node Type Selection**: Toggle between **MAX (Maximizing)** and **MIN (Minimizing)** root perspectives.
- **Guaranteed Aggressive Pruning**: Built-in tree generation logic ensuring early cut-offs and visual pruning across all generated structures.
- **Step-by-Step Execution Control**: Play, pause, step forward, step backward, and scrub through traversal states with adjustable execution speed.
- **Live Call Stack Tracker**: Real-time visualization of recursive function calls, active node evaluations, and tracking of $\alpha$ and $\beta$ bounds.
- **Responsive Scalable Canvas**: Interactive SVG node layout with zoom, pan, and full-screen support.
- **CSP Compliant**: Secure native recursive tree-cloning engine with zero reliance on dynamic string evaluation (`eval`).

---

## 🛠️ Project Structure

```text
alpha-beta-visualizer/
├── src/
│   ├── Core_algorithm/
│   │   ├── alphaBetaEngine.js   # Core Alpha-Beta search, traversal & stepping logic
│   │   └── treeGenerator.js     # Deterministic game tree generator with pruning layout
│   ├── UI/
│   │   └── Controls.jsx         # Sidebar sliders, root node toggles, and recursion stack
│   ├── Visualisation/
│   │   └── TreeVisualizer.jsx   # SVG canvas renderer with node states and controls
│   ├── Theory and logic/
│   │   └── TheoryPanel.jsx      # Educational breakdown of Alpha-Beta pruning theory
│   ├── App.jsx                  # Main application container and state controller
│   ├── main.jsx                 # React DOM mount point
│   └── index.css                # Tailwind CSS global styles
├── index.html                   # HTML entry point
└── package.json                 # Project dependencies
```

---

## 📦 Installation & Setup

1. **Clone or Download** the project repository to your local machine.
2. Open your terminal in the project root directory and install dependencies:
   ```bash
   npm install
   ```
3. Run the development server via Vite:
   ```bash
   npm run dev
   ```
4. Open the generated local URL (typically `http://localhost:5173`) in your web browser.

---

## 🧠 Algorithm Theory

Alpha-Beta pruning is an optimization technique for the minimax algorithm that reduces the number of nodes evaluated in the search tree.

- **$\alpha$ (Alpha)**: The best (highest) score guaranteed for the **MAX** player so far. Initialized to $-\infty$.
- **$\beta$ (Beta)**: The best (lowest) score guaranteed for the **MIN** player so far. Initialized to $+\infty$.
- **Cut-off Rule**: During traversal, if $\beta \le \alpha$, the remaining unvisited children of the current node are pruned because the opponent will choose a better option elsewhere, preventing further evaluation.