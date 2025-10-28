import { useCallback, useState } from "react";
import {
    type Node,
    type Edge,
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ConnectionMode
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import SideMenu from "./SideMenu";
import ClassNode, {
    type NodeData,
    type CustomNode,
    NodeType,
} from "./ClassNode";
import ButtonEdge from "./ButtonEdge";

const nodeTypes = { classNode: ClassNode };
const edgeTypes = { default: ButtonEdge };

const initialNodes: Node<NodeData>[] = [
    {
        id: "1",
        type: "classNode",
        position: { x: 100, y: 100 },
        data: {
            label: "Usuario",
            attributes: ["+id: number", "+nombre: string"],
            methods: ["login", "logout"],
            type: NodeType.squared,
        },
    },
    {
        id: "2",
        type: "classNode",
        position: { x: 400, y: 200 },
        data: {
            label: "Producto",
            attributes: ["+id: number", "+precio: float"],
            methods: ["calcularIVA"],
            type: NodeType.rounded,
        },
    },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export default function ClassDiagram() {
    const [closeEditingSignal, setCloseEditingSignal] = useState(0);
    const [idCounter, setIdCounter] = useState(3);
    // Estado inicial de nodos en la edicion
    const [initial_nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodes = initial_nodes.map(n => ({
        ...n,
        data: {
            ...n.data,
            closeEditingSignal,
        },
    }));

    const onConnect = useCallback(
        (params: any) =>{
            
            if (params.source === params.target) return;
            
            setEdges(eds => {

                const filteredEdges = eds.filter(
                    edge =>
                        !(
                            (edge.source === params.source && edge.target === params.target) ||
                            (edge.source === params.target && edge.target === params.source)
                        )
                );
                return addEdge(params, filteredEdges);
            }
        )},
        [setEdges],
    );

    const addClassNode = (typeOfNode: NodeType) => {
        const newId = `${idCounter}`;
        const newNode: CustomNode = {
            id: newId,
            type: "classNode",
            position: {
                x: Math.random() * 400 + 50,
                y: Math.random() * 300 + 50,
            },
            data: {
                label: `Clase${idCounter}`,
                attributes: [],
                methods: [],
                type: typeOfNode,
                closeEditingSignal,
            },
        };
        setNodes(nds => [...nds, newNode]);
        setIdCounter(prev => prev + 1);
    };

    const saveFigure = () => {
        const figure = {
            nodes: nodes.map(({ id, data, position }) => ({
                id,
                label: data.label,
                attributes: data.attributes,
                methods: data.methods,
                position,
            })),
            edges,
        };
        const figureJSON = JSON.stringify(figure, null, 2);
        const blob = new Blob([figureJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "class_diagram.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setNodes([]);
        setEdges([]);
        setIdCounter(1);
    };

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            {/* Botón para añadir clases */}
            <button
                onClick={saveFigure}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 10,
                    left: 130,
                    padding: "8px 12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                💾 Guardar Diagrama
            </button>
            <SideMenu addNode={addClassNode} />

            {/* Botón para borrar todo */}
            <button
                onClick={clearAll}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 10,
                    right: 10,
                    padding: "8px 12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                🗑 Borrar Todo
            </button>

            {/* Instrucciones */}
            <div
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 50,
                    right: 10,
                    backgroundColor: "white",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "12px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                }}
            >
                💡 Haz <strong>doble clic</strong> en una clase para editarla
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                onPaneClick={() => setCloseEditingSignal(s => s + 1)} // Cierra edición al clicar en el fondo
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}
