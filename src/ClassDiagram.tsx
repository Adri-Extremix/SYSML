import { useCallback, useState, useEffect } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ConnectionMode,
    type Node,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ClassNode from "./ClassNode";
import ButtonEdge from "./ButtonEdge";
import SideMenu from "./SideMenu";
import { getDiagram, type DiagramData, type NodeData } from "./api";

const nodeTypes = { classNode: ClassNode };
const edgeTypes = { default: ButtonEdge };

// Función para calcular posiciones automáticas si todas son (0,0)
function calculateAutoPositions(
    nodes: NodeData[],
    edges: DiagramData["edges"],
): NodeData[] {
    // Si todos los nodos tienen posición (0,0), calcular automáticamente
    const allZero = nodes.every(n => n.position.x === 0 && n.position.y === 0);

    if (!allZero) {
        return nodes;
    }

    // Encontrar nodo raíz (el que no es target de ningún edge)
    const targetIds = new Set(edges.map(e => e.target));
    const rootNodes = nodes.filter(n => !targetIds.has(n.id));

    // Crear mapa de hijos
    const childrenMap = new Map<string, string[]>();
    edges.forEach(edge => {
        if (!childrenMap.has(edge.source)) {
            childrenMap.set(edge.source, []);
        }
        childrenMap.get(edge.source)!.push(edge.target);
    });

    // Asignar posiciones en forma de árbol
    const positionedNodes = new Map<string, { x: number; y: number }>();
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 150;

    function positionNode(
        nodeId: string,
        x: number,
        y: number,
        level: number,
    ): number {
        const children = childrenMap.get(nodeId) || [];

        if (children.length === 0) {
            positionedNodes.set(nodeId, { x, y });
            return x + HORIZONTAL_SPACING;
        }

        let currentX = x;
        children.forEach(childId => {
            currentX = positionNode(
                childId,
                currentX,
                y + VERTICAL_SPACING,
                level + 1,
            );
        });

        // Centrar el nodo padre sobre sus hijos
        const firstChild = positionedNodes.get(children[0])!;
        const lastChild = positionedNodes.get(children[children.length - 1])!;
        const centerX = (firstChild.x + lastChild.x) / 2;

        positionedNodes.set(nodeId, { x: centerX, y });

        return currentX;
    }

    // Posicionar desde los nodos raíz
    let startX = 0;
    rootNodes.forEach(root => {
        startX = positionNode(root.id, startX, 0, 0);
    });

    // Aplicar posiciones calculadas
    return nodes.map(node => ({
        ...node,
        position: positionedNodes.get(node.id) || { x: 0, y: 0 },
    }));
}

export default function ClassDiagram() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [closeEditingSignal, setCloseEditingSignal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar diagrama del servidor al montar el componente
    useEffect(() => {
        async function loadDiagram() {
            try {
                setLoading(true);
                setError(null);
                const data = await getDiagram();

                // Calcular posiciones si son todas (0,0)
                const positionedNodes = calculateAutoPositions(
                    data.nodes,
                    data.edges,
                );

                // Transformar los nodos del servidor al formato de ReactFlow
                const loadedNodes: Node[] = positionedNodes.map(node => ({
                    id: node.id,
                    type: "classNode",
                    position: node.position,
                    data: {
                        label: node.label,
                        attributes: node.attributes || [],
                        methods: [],
                        type: "squared",
                        closeEditingSignal: 0,
                    },
                }));

                // Transformar los edges del servidor al formato de ReactFlow
                const loadedEdges: Edge[] = data.edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                }));

                setNodes(loadedNodes);
                setEdges(loadedEdges);
            } catch (err) {
                console.error("Error cargando diagrama:", err);
                setError("No se pudo cargar el diagrama del servidor");
            } finally {
                setLoading(false);
            }
        }

        loadDiagram();
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => {
            if (params.source === params.target) {
                return;
            }

            setEdges(eds => {
                const filteredEdges = eds.filter(
                    edge =>
                        !(
                            (edge.source === params.source &&
                                edge.target === params.target) ||
                            (edge.source === params.target &&
                                edge.target === params.source)
                        ),
                );
                return addEdge(params, filteredEdges);
            });
        },
        [setEdges],
    );

    const addClassNode = useCallback(
        (type: string) => {
            const newId = `${Date.now()}`;
            const newNode: Node = {
                id: newId,
                type: "classNode",
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: {
                    label: "Nueva Clase",
                    attributes: [],
                    methods: [],
                    type: type,
                    closeEditingSignal: closeEditingSignal,
                    onChange: (newData: any) => {
                        setNodes(nds =>
                            nds.map(n =>
                                n.id === newId
                                    ? {
                                          ...n,
                                          data: {
                                              ...n.data,
                                              ...newData,
                                              onChange: n.data.onChange,
                                          },
                                      }
                                    : n,
                            ),
                        );
                    },
                },
            };
            setNodes(nds => [...nds, newNode]);
        },
        [setNodes, closeEditingSignal],
    );

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                Cargando diagrama...
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <SideMenu addNode={addClassNode} />

            {error && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        top: 10,
                        right: 10,
                        padding: "8px",
                        backgroundColor: "#ffebee",
                        color: "#c62828",
                        borderRadius: "4px",
                    }}
                >
                    {error}
                </div>
            )}

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
                onPaneClick={() => setCloseEditingSignal(s => s + 1)}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}
