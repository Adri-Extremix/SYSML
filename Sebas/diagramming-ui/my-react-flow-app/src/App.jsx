import { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  ReactFlowProvider, // <-- Added
  useReactFlow // <-- Added
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

function layoutElements(nodes, edges, direction = 'TB') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - nodeWidth / 2,
        y: pos.y - nodeHeight / 2,
      },
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
    };
  });
}

// NEW COMPONENT: Ensures fitView runs after nodes are loaded and laid out
function FitViewOnLoad({ nodes }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      // Small timeout ensures DOM elements are rendered before calculating view bounds
      const timeoutId = setTimeout(() => {
        fitView({ padding: 0.2, duration: 200 }); 
      }, 5);

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, fitView]);

  return null;
}
// ----------------------------------------------------


export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);


  // Fetch diagram data from your API endpoint
  useEffect(() => {
    async function loadDiagram() {
      try {
        const response = await fetch("https://localhost:7296/api/Diagram");
        const data = await response.json();

        const reactFlowNodes = data.nodes.map(n => ({
          id: n.id,
          position: n.position || { x: 0, y: 0 },
          data: { label: n.label }
        }));

        const reactFlowEdges = data.edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target
        }));

        // Apply Dagre auto layout (default top–bottom)
        const layoutedNodes = layoutElements(reactFlowNodes, reactFlowEdges, "TB");

        setNodes(layoutedNodes);
        setEdges(reactFlowEdges);

      } catch (err) {
        console.error("Failed to load diagram:", err);
      }
    }


    loadDiagram();
  }, []);

  // ReactFlow callbacks
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // fitView REMOVED: Centering is now handled by FitViewOnLoad
        >
          {/* Component to trigger fitView after nodes are loaded */}
          <FitViewOnLoad nodes={nodes} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}