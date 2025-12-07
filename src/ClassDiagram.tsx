import { useCallback, useState } from "react";
import "./ClassDiagram.css";

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
    ConnectionMode,
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

// 1. ACTUALIZADO: Los nodos iniciales ahora usan la estructura de compartimentos
const initialNodes: Node<NodeData>[] = [
    {
        id: "1",
        type: "classNode",
        position: { x: 100, y: 100 },
        data: {
            label: "Usuario",
            type: NodeType.squared,
            compartments: [
                {
                    id: "c1",
                    label: "attributes",
                    items: ["+id: number", "+nombre: string"]
                },
                {
                    id: "c2",
                    label: "operations",
                    items: ["login()", "logout()"]
                }
            ]
        },
    },
    {
        id: "2",
        type: "classNode",
        position: { x: 400, y: 200 },
        data: {
            label: "Producto",
            type: NodeType.rounded,
            compartments: [
                {
                    id: "c1",
                    label: "attributes",
                    items: ["+id: number", "+precio: float"]
                },
                {
                    id: "c2",
                    label: "operations",
                    items: ["calcularIVA()"]
                }
            ]
        },
    },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export default function ClassDiagram() {
    const [closeEditingSignal, setCloseEditingSignal] = useState(0);
    const [idCounter, setIdCounter] = useState(3);
    
    // Estado inicial de nodos
    const [initial_nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Inyectar la señal de cierre en los nodos
    const nodes = initial_nodes.map(n => ({
        ...n,
        data: {
            ...n.data,
            closeEditingSignal,
        },
    }));

    const onConnect = useCallback(
        (params: any) => {
            if (params.source === params.target) return;

            setEdges(eds => {
                const filteredEdges = eds.filter(
                    edge =>
                        !(
                            (edge.source === params.source && edge.target === params.target) ||
                            (edge.source === params.target && edge.target === params.source)
                        ),
                );
                return addEdge(params, filteredEdges);
            });
        },
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
                // 2. ACTUALIZADO: Inicializamos compartments vacío
                compartments: [], 
                type: typeOfNode,
                closeEditingSignal,
            },
        };
        setNodes(nds => [...nds, newNode]);
        setIdCounter(prev => prev + 1);
    };

    const saveFigure = () => {
        // Ensure edges exported include markerStart/markerEnd (from edge.data if present)
        const exportEdges = edges.map(e => {
            const markerStart = (e.data && (e.data as any).markerStart) ?? "";
            const markerEnd = (e.data && (e.data as any).markerEnd) ?? "";
            const label = (e.data && (e.data as any).label) ?? (e.label ?? "");
            return {
                ...e,
                data: {
                    ...(e.data ?? {}),
                    markerStart,
                    markerEnd,
                    label,
                },
            };
        });

        // 3. ACTUALIZADO: Guardamos la propiedad 'compartments'
        const figure = {
            nodes: nodes.map(({ id, data, position }) => ({
                id,
                label: data.label,
                compartments: data.compartments, // Aquí estaba el error, antes ponía attributes/methods
                type: data.type, // Es útil guardar el tipo (rounded/squared)
                position,
            })),
            edges: exportEdges,
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
            <button className="save-button" onClick={saveFigure}>
                💾 Guardar Diagrama
            </button>
            <SideMenu addNode={addClassNode} />

            {/* Botón para borrar todo */}
            <button className="delete-button" onClick={clearAll}>
                🗑 Borrar Todo
            </button>

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