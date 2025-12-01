using System;
using System.Collections.Generic;
using System.Text;

namespace Diagramming.Interfaces {
    /// <summary>
    /// The IRPGraphNode interface represents either a boxed element (for example, a class box) or a point element(for example, a connector) in a diagram.
    /// </summary>
    public interface IGraphNode : IGraphElement{
        public Dictionary<string, string> Attributes { get; set; }
    }
}
