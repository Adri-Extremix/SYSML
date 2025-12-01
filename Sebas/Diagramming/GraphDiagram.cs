using System;
using System.Collections.Generic;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming {
    public class GraphDiagram : VisualElement, IGraphDiagram{
        public GraphDiagram (Guid id, string label, string type, List<IGraphElement> elements, IModelElementAdapter adapter) {
            Id = id;
            Label = label;
            AddSubElements(elements);
            ModelElementAdapter = adapter;
        }

        public GraphDiagram(string label, string type, IModelElementAdapter adapter) {
            Id = Guid.NewGuid();
            Label = label;
            ModelElementAdapter = adapter;
        }

        /// <summary>
        /// Diagram of this presentation element.
        /// </summary>
        public override IGraphDiagram Diagram => this;
        public IReadOnlyList<IVisualElement> AllDiagramElements {
            get {
                var result = new List<IVisualElement>();
                GetAllSubElementsRecursive(this, ref result);
                return result;
            }
        }


    }
}
