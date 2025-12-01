using System;
using Diagramming.Interfaces;
using System.Numerics;

namespace Diagramming {
    /// <summary>
    /// The base for all graphical elements on a diagram.
    /// </summary>
    public abstract class GraphElement : VisualElement, IGraphElement{
        public GraphElement(Guid id, string label, IVisualElement graphicalParent, IModelElementAdapter modelElementAdapter, Point2D position) {
            Id = id;
            Label = label;
            GraphicalParent = graphicalParent;
            ModelElementAdapter = modelElementAdapter;
            Position = position;
            graphicalParent.AddSubElement(this);

        }

        public GraphElement(string label, IVisualElement graphicalParent, IModelElementAdapter modelElementAdapter, Point2D position) {
            Id = Guid.NewGuid();
            Label = label;
            GraphicalParent = graphicalParent;
            ModelElementAdapter = modelElementAdapter;
            Position = position;
            graphicalParent.AddSubElement(this);
        }

        public IVisualElement GraphicalParent { get; private set; } 

        /// <summary>
        /// Diagram of this presentation element.
        /// </summary>
        public override IGraphDiagram Diagram { 
            get {
                if (GraphicalParent is IGraphDiagram diagram) {
                    return diagram;
                }
                else {
                    return GraphicalParent.Diagram;
                }
            }
        }

        public Point2D Position { get; set; }
    }
}
