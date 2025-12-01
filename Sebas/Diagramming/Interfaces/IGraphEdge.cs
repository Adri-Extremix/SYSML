using System;
using System.Collections.Generic;
using System.Text;

namespace Diagramming.Interfaces {
    /// <summary>
    /// Represents a linear element of a diagram, such as a transition. 
    /// </summary>
    public interface IGraphEdge : IGraphElement{
        /// <summary>
        /// The point at which the  edge is connected to the source.
        /// </summary>
        IGraphNode Source { get; }
        /// <summary>
        /// The point at which the  edge is connected to the target.
        /// </summary>
        IGraphNode Target { get; }
    }
}
