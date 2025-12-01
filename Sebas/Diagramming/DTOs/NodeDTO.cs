using System;
using System.Collections.Generic;
using System.Text;
using Diagramming.Interfaces;

namespace Diagramming.DTOs {
    public class NodeDTO {
        public NodeDTO() { 
        }
        public NodeDTO(IGraphNode node) {
            Id = node.Id.ToString();
            Label = node.Label;
            Position = node.Position;
            Attributes = node.Attributes;
        }
        public string Id { get; set; }
        public string Label { get; set; }
        public Dictionary<string, string> Attributes { get; set; }
        public Point2D Position { get; set; }
    }
}
