using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming {
    public abstract class VisualElement : IVisualElement {
        public Guid Id { get; set; }
        public string Label { get; set; }
        /// <summary>
        /// Returns model element adapter of this visual element. Some presentation elements (for example TextBoxes) do not have model elements.
        /// </summary>
        public IModelElementAdapter ModelElementAdapter { get; set; }

        public abstract IGraphDiagram Diagram { get; }

        private HashSet<IGraphElement> _subElements = new HashSet<IGraphElement>();
        public IReadOnlyCollection<IGraphElement> SubElements { get => _subElements; }
        public void AddSubElements(IEnumerable<IGraphElement> graphElements) {
            foreach(var graphElement in graphElements) {
                _subElements.Add(graphElement);
            }
        }
        public void AddSubElement(IGraphElement graphElement) {
            _subElements.Add(graphElement);
        }
        public void RemoveSubElement(IGraphElement graphElement) {
            _subElements.Remove(graphElement);
        }
        protected void GetAllSubElementsRecursive(IVisualElement el, ref List<IVisualElement> result) {
            foreach (var graphElement in el.SubElements) {
                result.Add(graphElement);
                GetAllSubElementsRecursive(graphElement, ref result);
            }
        }
    }
}
