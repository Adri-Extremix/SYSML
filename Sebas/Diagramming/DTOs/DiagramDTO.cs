using System;
using System.Collections.Generic;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming.DTOs {
    public class DiagramDTO {
        public DiagramDTO(IGraphDiagram diagram) {
            foreach (IVisualElement element in diagram.AllDiagramElements) {
                if(element is IGraphNode node) {
                    var nodeDto = new NodeDTO(node);
                    Nodes.Add(nodeDto);
                }
                else if(element is IGraphEdge edge){
                    var edgeDto = new EdgeDTO(edge);
                    Edges.Add(edgeDto);
                }
            }
        }
        public List<NodeDTO> Nodes { get; private set; } = new List<NodeDTO> ();
        public List<EdgeDTO> Edges { get; private set; } = new List<EdgeDTO>();
    }
}
