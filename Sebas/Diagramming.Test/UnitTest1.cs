namespace Diagramming.Test {
    public class Tests {

        [Test]
        public void BasicHierarchyTest() {
            var diagram = new GraphDiagram("my diagram", "bdd", null);
            var node1 = new GraphNode("node1", diagram, null, new Point2D());
            Assert.IsTrue(node1.GraphicalParent == diagram);
            Assert.IsTrue(node1.Diagram == diagram);
            Assert.IsTrue(diagram.Diagram == diagram);
            Assert.IsTrue(diagram.SubElements.Count == 1);
            Assert.IsTrue(diagram.AllDiagramElements.Count == 1);
            Assert.IsTrue(diagram.SubElements.First() == node1);
            Assert.IsTrue(diagram.AllDiagramElements.First() == node1);
            var node2 = new GraphNode("node2", node1, null, new Point2D());
            Assert.IsTrue(node1.SubElements.Count == 1);
            Assert.IsTrue(diagram.SubElements.Count == 1);
            Assert.IsTrue(diagram.AllDiagramElements.Count == 2);
            Assert.IsTrue(node2.GraphicalParent == node1);
            Assert.IsTrue(node2.Diagram == diagram);
        }
    }
}