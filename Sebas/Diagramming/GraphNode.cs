using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;
using Diagramming.Interfaces;

namespace Diagramming {
    public class GraphNode : GraphElement, IGraphNode {
        public GraphNode(Guid id, string label, IVisualElement graphicalParent,
                         IModelElementAdapter modelElementAdapter, Point2D position, Dictionary<string, string> attributes)
            : base(id, label, graphicalParent, modelElementAdapter, position) {
            Attributes = attributes;
        }
        public GraphNode(string label, IVisualElement graphicalParent,
                 IModelElementAdapter modelElementAdapter, Point2D position, Dictionary<string, string> attributes)
            : base( label, graphicalParent, modelElementAdapter, position) {
            Attributes = attributes;
        }
        public GraphNode(string label, IVisualElement graphicalParent,
                IModelElementAdapter modelElementAdapter, Point2D position)
            : base(label, graphicalParent, modelElementAdapter, position) {
        }

        public Dictionary<string, string> Attributes { get; set; }

    }

}
