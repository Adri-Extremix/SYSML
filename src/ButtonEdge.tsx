import React, { useState } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    Handle,
    Position,
    useReactFlow,
    MarkerType,
    type EdgeProps,
} from "@xyflow/react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

const markers = {
    none: "Arrow::None",
    association: "Arrow::Association",
    ownedMembership: "Arrow::OwnedMembership",
    unownedMembership: "Arrow::UnownedMembership",
    subclassification: "Arrow::Subclassification",
    partDefined: "Arrow::PartDefined",
    redefinition: "Arrow::Redefinition",
    partPerforms: "Arrow::PartPerforms",
    composition: "Arrow::Composition",
    aggregation: "Arrow::Aggregation",
    timeSlice: "Arrow::TimeSlice",
};

let items = Object.values(markers).map(x => (
    <MenuItem value={x}>{x.substring(7)}</MenuItem>
));

export default function CustomEdge(props: EdgeProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState("");
    const [markerStart, setMarkerStart] = useState(markers.none);
    const [markerEnd, setMarkerEnd] = useState(markers.association);
    const [edgePath, labelX, labelY] = getBezierPath(props);

    const { setEdges } = useReactFlow();
    const onEdgeClick = () => {
        setIsEditing(true);
    };

    const onDelete = () => {
        setEdges(edges => edges.filter(edge => edge.id !== props.id));
    };

    const onFinish = () => {
        setIsEditing(false);
    };

    const handleSetMarkerStart = (event: SelectChangeEvent) => {
        setMarkerStart(event.target.value as string);
    };

    const handleSetMarkerEnd = (event: SelectChangeEvent) => {
        setMarkerEnd(event.target.value as string);
    };

    if (!isEditing) {
        return (
            <>
                <BaseEdge
                    path={edgePath}
                    {...props}
                    markerStart={`url(#${markerStart})`}
                    markerEnd={`url(#${markerEnd})`}
                />
                <EdgeLabelRenderer>
                    <div
                        className="button-edge__label nodrag nopan"
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                    >
                        <button
                            className="button-edge__button"
                            onClick={onEdgeClick}
                        >
                            {label === "" ? "..." : label}
                        </button>
                    </div>
                </EdgeLabelRenderer>
            </>
        );
    } else {
        return (
            <>
                <BaseEdge
                    path={edgePath}
                    {...props}
                    markerStart={`url(#${markerStart})`}
                    markerEnd={`url(#${markerEnd})`}
                />
                <EdgeLabelRenderer>
                    <div
                        className="button-edge__label nodrag nopan"
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                    >
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
                                <label
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Nombre:
                                </label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={e => setLabel(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "4px",
                                        marginTop: "2px",
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <button
                                    onClick={onDelete}
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
                                <button
                                    onClick={onFinish}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "green",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                >
                                    Ok
                                </button>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Marker Start
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={markerStart}
                                        label="Age"
                                        onChange={handleSetMarkerStart}
                                    >
                                        {items}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Marker Start
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={markerEnd}
                                        label="Age"
                                        onChange={handleSetMarkerEnd}
                                    >
                                        {items}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <Handle type="source" position={Position.Right} />
                        <Handle type="target" position={Position.Left} />
                    </div>
                </EdgeLabelRenderer>
            </>
        );
    }
}
