using System;
using System.Collections.Generic;
using System.Text;

namespace Diagramming.Interfaces {
    public interface IModelElementAdapter {
        string Id { get; }
        string Name { get; }
        string Metaclass { get; }    
    }
}
