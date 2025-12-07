import React, { useState, useCallback } from "react";
import {
    type NodeProps,
    type Node,
    useReactFlow,
    Handle,
    Position,
} from "@xyflow/react";

// --- TIPOS ---

export enum NodeType {
    rounded = "rounded",
    squared = "squared",
}

// Definición de un Compartimento según SysML
export type NodeCompartment = {
    id: string;      // Identificador único para manejo de estado
    label: string;   // El nombre de la vista (ej: "attributes", "parts", "ports")
    items: string[]; // El contenido textual
};

type NodeUserData = {
    label: string;
    // Reemplazamos attributes/methods fijos por una lista dinámica
    compartments: NodeCompartment[]; 
};

export type NodeData = NodeUserData & { type: NodeType };

type NodeMethods = {
    closeEditingSignal: number;
};

export type CustomNode = Node<NodeData & NodeMethods>;

// --- COMPONENTE ---

export default function ClassNode({
    data,
    selected,
    id,
}: NodeProps<CustomNode>) {
    const { setNodes, setEdges } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    
    // Inicialización segura de datos (si viene vacío)
    const [editData, setEditData] = useState<NodeUserData>({
        label: data.label || "Bloque",
        compartments: data.compartments ? [...data.compartments] : []
    });

    const [showHandles, setShowHandles] = useState(false);

    // Sincronizar cancelación externa
    React.useEffect(() => {
        if (isEditing) handleCancel();
    }, [data.closeEditingSignal]);

    // --- MANEJADORES DE EVENTOS ---

    const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        // Al entrar a editar, copiamos los datos actuales del nodo al estado local de edición
        setEditData({
            label: data.label,
            compartments: data.compartments ? JSON.parse(JSON.stringify(data.compartments)) : []
        });
        setIsEditing(true);
    };

    const handleSave = () => {
            // 1. Preparamos los compartimentos limpios (quitamos items vacíos)
            const cleanCompartments = editData.compartments.map(c => ({
                ...c,
                items: c.items.filter(item => item.trim() !== "")
            }));

            // 2. Usamos setNodes para actualizar el estado GLOBAL de React Flow
            // Esto es crucial: creamos un nuevo objeto para el nodo, lo que fuerza el re-render
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                label: editData.label,
                                compartments: cleanCompartments,
                            },
                        };
                    }
                    return node;
                })
            );

            setIsEditing(false);
            setShowHandles(false);
        };

    const handleCancel = () => {
        setIsEditing(false);
        setShowHandles(false);
    };

    const handleDeleteNode = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) =>
            edges.filter((edge) => edge.source !== id && edge.target !== id)
        );
    };

    // --- LÓGICA DE COMPARTIMENTOS (EDIT MODE) ---

    const addCompartment = () => {
        setEditData(prev => ({
            ...prev,
            compartments: [
                ...prev.compartments,
                { 
                    id: crypto.randomUUID(), // O usar Date.now().toString() si no tienes soporte seguro
                    label: "new compartment", 
                    items: [] 
                }
            ]
        }));
    };

    const removeCompartment = (compartmentId: string) => {
        setEditData(prev => ({
            ...prev,
            compartments: prev.compartments.filter(c => c.id !== compartmentId)
        }));
    };

    const updateCompartmentLabel = (compartmentId: string, newLabel: string) => {
        setEditData(prev => ({
            ...prev,
            compartments: prev.compartments.map(c => 
                c.id === compartmentId ? { ...c, label: newLabel } : c
            )
        }));
    };

    const updateCompartmentItems = (compartmentId: string, text: string) => {
        setEditData(prev => ({
            ...prev,
            compartments: prev.compartments.map(c => 
                c.id === compartmentId ? { ...c, items: text.split("\n") } : c
            )
        }));
    };

    // --- RENDERIZADO DE HANDLES ---
    const renderHandles = useCallback(() => {
        const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];
        const handlesPerSide = 3; // Reducido a 3 para limpieza visual, ajustable
        const handles: React.ReactElement[] = [];

        positions.forEach((position) => {
            for (let i = 0; i < handlesPerSide; i++) {
                const offset = ((i + 1) / (handlesPerSide + 1)) * 100;
                const isVertical = position === Position.Top || position === Position.Bottom;
                
                handles.push(
                    <Handle
                        key={`${position}-${i}`}
                        type="source" // En React Flow moderno 'source' suele valer para ambos si connectionMode es loose
                        position={position}
                        id={`${position}-${i}`}
                        style={{
                            [isVertical ? "left" : "top"]: `${offset}%`,
                            opacity: showHandles ? 1 : 0,
                            transition: "opacity 0.2s",
                            width: "8px", height: "8px", background: "#555"
                        }}
                    />
                );
            }
        });
        return handles;
    }, [showHandles]);

    const borderRadiusValue = data.type === "rounded" ? 12 : 0;

    // --- VISTA DE EDICIÓN (FORMULARIO) ---
    if (isEditing) {
        return (
            <div style={{
                border: "2px solid #2196F3", borderRadius: "4px", backgroundColor: "white",
                minWidth: "250px", padding: "10px", fontFamily: "Arial, sans-serif",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 10
            }}>
                {/* Título del Nodo */}
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", color: "#888" }}>Nombre del Bloque</label>
                    <input
                        type="text"
                        value={editData.label}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                        style={{ width: "100%", padding: "5px", fontWeight: "bold" }}
                        autoFocus
                    />
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

                {/* Lista dinámica de Compartimentos */}
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {editData.compartments.map((comp) => (
                        <div key={comp.id} style={{ marginBottom: "12px", background: "#f9f9f9", padding: "8px", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <input 
                                    value={comp.label}
                                    onChange={(e) => updateCompartmentLabel(comp.id, e.target.value)}
                                    placeholder="Nombre compartimento (ej: attributes)"
                                    style={{ fontSize: "12px", width: "70%", border: "1px solid #ddd" }}
                                />
                                <button 
                                    onClick={() => removeCompartment(comp.id)}
                                    style={{ background: "transparent", border: "none", color: "red", cursor: "pointer", fontSize: "16px" }}
                                    title="Eliminar compartimento"
                                >&times;</button>
                            </div>
                            <textarea
                                value={comp.items.join("\n")}
                                onChange={(e) => updateCompartmentItems(comp.id, e.target.value)}
                                placeholder="Items (uno por línea)"
                                style={{ width: "100%", minHeight: "50px", fontSize: "12px", resize: "vertical", border: "1px solid #ddd" }}
                            />
                        </div>
                    ))}
                </div>

                <button 
                    onClick={addCompartment}
                    style={{ 
                        width: "100%", padding: "6px", marginBottom: "10px", 
                        backgroundColor: "#e0e0e0", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" 
                    }}
                >
                    + Añadir Compartimento
                </button>

                {/* Botonera de Acción */}
                <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end", marginTop: "10px" }}>
                     <button onClick={handleDeleteNode} style={{ backgroundColor: "#b4160b", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer" }}>🗑️</button>
                    <button onClick={handleCancel} style={{ backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer" }}>Cancelar</button>
                    <button onClick={handleSave} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer" }}>Guardar</button>
                </div>
            </div>
        );
    }

    // --- VISTA NORMAL (NODO SYSML) ---
    return (
        <div
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setShowHandles(true)}
            onMouseLeave={() => setShowHandles(false)}
            style={{
                border: selected ? "2px solid #2196F3" : "2px solid #333",
                borderRadius: borderRadiusValue,
                backgroundColor: "white",
                minWidth: "160px",
                maxWidth: "300px",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
                boxShadow: selected ? "0 0 10px rgba(33, 150, 243, 0.3)" : "2px 2px 5px rgba(0,0,0,0.1)",
                overflow: "hidden" // Asegura que el contenido respete el border-radius
            }}
        >
            {/* Cabecera del Nodo (Nombre del Bloque) */}
            <div
                style={{
                    backgroundColor: "#f4f4f4",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    borderBottom: "1px solid #333",
                    // En SysML, los headers a veces llevan el estereotipo «block»
                    display: "flex", flexDirection: "column"
                }}
            >
                {/* Opcional: Estereotipo SysML */}
                {/* <span style={{fontSize: "10px", fontWeight: "normal"}}>«block»</span> */}
                <span>{data.label}</span>
            </div>

            {/* Renderizado Dinámico de Compartimentos */}
            {data.compartments && data.compartments.length > 0 ? (
                data.compartments.map((comp, index) => (
                    <div 
                        key={comp.id || index} 
                        style={{ 
                            padding: "4px 8px 8px 8px", 
                            borderBottom: index < data.compartments.length - 1 ? "1px solid #333" : "none",
                            textAlign: "left"
                        }}
                    >
                        {/* SysML: View Name como etiqueta del compartimento */}
                        {comp.label && (
                            <div style={{ 
                                fontSize: "10px", 
                                fontStyle: "italic", 
                                color: "#555", 
                                marginBottom: "2px",
                                textTransform: "lowercase" 
                            }}>
                                {comp.label}
                            </div>
                        )}
                        
                        {/* Lista de elementos */}
                        {comp.items.length > 0 ? (
                            comp.items.map((item, i) => (
                                <div key={i} style={{ fontSize: "13px", paddingLeft: "2px" }}>
                                    {item}
                                </div>
                            ))
                        ) : (
                            <div style={{ fontSize: "11px", color: "#999", fontStyle: "italic" }}>(vacío)</div>
                        )}
                    </div>
                ))
            ) : (
                // Estado vacío visual
                <div style={{ padding: "10px", textAlign: "center", fontSize: "12px", color: "#888" }}>
                    (Doble click para añadir compartimentos)
                </div>
            )}

            {renderHandles()}
        </div>
    );
}