const API_BASE_URL = "http://localhost:5171"; // Puerto HTTP del servidor

export interface DiagramData {
    nodes: NodeData[];
    edges: EdgeData[];
}

export interface NodeData {
    id: string;
    label: string;
    attributes: string[] | null;
    position: { x: number; y: number };
}

export interface EdgeData {
    id: string;
    source: string;
    target: string;
}

// Obtener un diagrama del servidor
export async function getDiagram(): Promise<DiagramData> {
    const response = await fetch(`${API_BASE_URL}/api/Diagram`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error al obtener diagrama: ${response.statusText}`);
    }

    return response.json();
}

// Guardar un diagrama en el servidor
export async function saveDiagram(diagram: DiagramData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Diagram`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(diagram),
    });

    if (!response.ok) {
        throw new Error(`Error al guardar diagrama: ${response.statusText}`);
    }
}