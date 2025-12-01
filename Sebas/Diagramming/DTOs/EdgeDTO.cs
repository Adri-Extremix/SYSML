using System;
using System.Collections.Generic;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming.DTOs {
    public class EdgeDTO {
        public EdgeDTO() { }
        public EdgeDTO(IGraphEdge edge) { 
            Id = edge.Id.ToString();
            Source = edge.Source.Id.ToString();
            Target = edge.Target.Id.ToString();
        }

        public string Id { get; set; }
        public string Source { get; set; }  
        public string Target { get; set; }  
    }
}
