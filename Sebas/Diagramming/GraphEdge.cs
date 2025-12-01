using System;
using System.Collections.Generic;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming {
    public class GraphEdge : GraphElement, IGraphEdge {
        public GraphEdge(Guid id, string label, IVisualElement graphicalParent,
                 IModelElementAdapter modelElementAdapter, Point2D position, IGraphNode source, IGraphNode target)
            : base(id, label, graphicalParent, modelElementAdapter, position) {
            Source = source;
            Target = target;
        }

        public IGraphNode Source { get; }
        public IGraphNode Target { get; }
    }
}
