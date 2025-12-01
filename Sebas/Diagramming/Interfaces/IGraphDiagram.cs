using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace Diagramming.Interfaces {
    /// <summary>
    /// The top-level container that holds all graphical elements.
    /// </summary>
    public interface IGraphDiagram : IVisualElement {
        IReadOnlyList<IVisualElement> AllDiagramElements { get; }
    }
}
