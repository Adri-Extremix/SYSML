import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    type EdgeProps,
} from "@xyflow/react";

export default function CustomEdge(props: EdgeProps) {
    const { id, markerEnd, style } = props;
    const [edgePath, labelX, labelY] = getBezierPath(props);

    const { setEdges } = useReactFlow();
    const onEdgeClick = () => {
        setEdges(edges => edges.filter(edge => edge.id !== props.id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
