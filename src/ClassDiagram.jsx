import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Nodo UML
function ClassNode({ data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  // Cerrar el modo edición si se recibe la señal
  React.useEffect(() => {
    if (isEditing) handleCancel();
    // eslint-disable-next-line
  }, [data.closeEditingSignal]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    data.label = editData.label;
    data.attributes = editData.attributes?.filter((a) => a.trim());
    data.methods = editData.methods?.filter((m) => m.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  /** Funcion que elimina toda la informacion del nodo y se mantiene en modo edicion
   *  Si hay click en borrar, se limpian los datos y si pulsa en guardar, se guardan los datos vacios
   *  Si pulsa en cancelar, se restauran los datos anteriores
   */
  const handleDeleteContent = () => {
    setEditData({
      label: "",
      attributes: [],
      methods: [],
    });
    // Mantener el modo edición para que el usuario pueda guardar los datos vacíos
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete();
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        style={{
          border: "2px solid #2196F3",
          borderRadius: "4px",
          backgroundColor: "white",
          minWidth: "200px",
          fontFamily: "Arial, sans-serif",
          padding: "10px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>
            Nombre:
          </label>
          <input
            type="text"
            value={editData.label}
            onChange={(e) =>
              setEditData({ ...editData, label: e.target.value })
            }
            style={{ width: "100%", padding: "4px", marginTop: "2px" }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>
            Atributos (uno por línea):
          </label>
          <textarea
            value={editData.attributes?.join("\n")}
            onChange={(e) =>
              setEditData({
                ...editData,
                attributes: e.target.value.split("\n"),
              })
            }
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "4px",
              marginTop: "2px",
              minHeight: "60px",
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>
            Métodos (uno por línea):
          </label>
          <textarea
            value={editData.methods?.join("\n")}
            onChange={(e) =>
              setEditData({ ...editData, methods: e.target.value.split("\n") })
            }
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "4px",
              marginTop: "2px",
              minHeight: "60px",
              resize: "vertical",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              onClick={handleSave}
              style={{
                padding: "4px 8px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: "4px 8px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                marginLeft: "6px",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteContent}
              style={{
                padding: "4px 8px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                marginLeft: "6px",
              }}
            >
              Borrar contenido
            </button>
          </div>
          <div>
            <button
              onClick={handleDelete}
              style={{
                padding: "4px 8px",
                backgroundColor: "#b4160bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🗑️
            </button>
          </div>
        </div>
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        border: selected ? "2px solid #2196F3" : "2px solid #333",
        borderRadius: "4px",
        backgroundColor: "white",
        minWidth: "160px",
        fontFamily: "Arial, sans-serif",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "6px",
          textAlign: "center",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
        }}
      >
        {data.label}
      </div>
      <div style={{ padding: "6px", borderBottom: "1px solid #333" }}>
        {data.attributes?.length > 0 ? (
          data.attributes.map((attr, i) => (
            <div key={i} style={{ fontSize: "14px" }}>
              {attr}
            </div>
          ))
        ) : (
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "#666" }}>
            (sin atributos)
          </div>
        )}
      </div>
      <div style={{ padding: "6px" }}>
        {data.methods?.length > 0 ? (
          data.methods.map((m, i) => (
            <div key={i} style={{ fontSize: "14px", fontStyle: "italic" }}>
              {m}()
            </div>
          ))
        ) : (
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "#666" }}>
            (sin métodos)
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

const nodeTypes = { classNode: ClassNode };

const initialNodes = [
  {
    id: "1",
    type: "classNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Usuario",
      attributes: ["+id: number", "+nombre: string"],
      methods: ["login", "logout"],
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
    },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function ClassDiagram() {
  const [closeEditingSignal, setCloseEditingSignal] = useState(0);
  const [idCounter, setIdCounter] = useState(3);
  // Estado inicial de nodos en la edicion
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        closeEditingSignal,
        onDelete: () => {
          setNodes((nds) => nds.filter((n) => n.id !== node.id));
          setEdges((eds) =>
            eds.filter((e) => e.source !== node.id && e.target !== node.id),
          );
        },
      },
    })),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addClassNode = () => {
    const newId = `${idCounter}`;
    const newNode = {
      id: newId,
      type: "classNode",
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      data: {
        label: `Clase${idCounter}`,
        attributes: [],
        methods: [],
        onDelete: () => {
          setNodes((nds) => nds.filter((n) => n.id !== newId));
          setEdges((eds) =>
            eds.filter((e) => e.source !== newId && e.target !== newId),
          );
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setIdCounter((prev) => prev + 1);
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

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Botón para añadir clases */}
      <button
        onClick={addClassNode}
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          padding: "8px 12px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ➕ Añadir Clase
      </button>
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

      {/* Instrucciones */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
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
        fitView
        onPaneClick={() => setCloseEditingSignal((s) => s + 1)} // Cierra edición al clicar en el fondo
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
