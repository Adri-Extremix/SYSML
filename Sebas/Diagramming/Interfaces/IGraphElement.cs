using System;
using System.Collections.Generic;
using System.Text;

namespace Diagramming.Interfaces {
    public interface IGraphElement : IVisualElement{
        IVisualElement GraphicalParent { get; }
        Point2D Position { get; }
    }
}
