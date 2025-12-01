using System;
using System.Collections.Generic;
using System.Text;

namespace Diagramming.Interfaces {
    public interface IVisualElement {

        Guid Id { get; }

        string Label { get; set; }

        IModelElementAdapter ModelElementAdapter { get; }

        /// <summary>
        /// Diagram of this visualElement element.
        /// </summary>
        IGraphDiagram Diagram { get; }

        IReadOnlyCollection<IGraphElement> SubElements { get; }
        void AddSubElement(IGraphElement visualElement);
        void RemoveSubElement(IGraphElement visualElement);
    }
}
