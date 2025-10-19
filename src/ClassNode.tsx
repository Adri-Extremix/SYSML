import React, { useState } from "react";
import {
  type NodeProps,
  type Node,
  Handle,
  Position,
} from "@xyflow/react";

export enum NodeType {
  rounded = "rounded",
  squared = "squared",
}

type NodeUserData = {
  label: string,
  attributes: string[],
  methods: string[],
}

export type NodeData = NodeUserData & { type: NodeType }

type NodeMethods = {
  closeEditingSignal: number
  onDelete: () => void,
}

export type CustomNode = Node<NodeData & NodeMethods>;

// Nodo UML
export default function ClassNode({ data, selected }: NodeProps<CustomNode>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data as NodeUserData);

  // Cerrar el modo edición si se recibe la señal
  React.useEffect(() => {
    if (isEditing) handleCancel();
  }, [data.closeEditingSignal]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
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

  const borderRadiusValue = data.type == "rounded" ? 12 : 0;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        border: selected ? "2px solid #2196F3" : "2px solid #333",
        borderRadius: borderRadiusValue,
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
          borderRadius: borderRadiusValue,
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
