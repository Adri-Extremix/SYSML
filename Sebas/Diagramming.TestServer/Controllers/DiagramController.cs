using System.IO; // Added for Directory.GetCurrentDirectory()
using Microsoft.AspNetCore.Mvc;

namespace Diagramming.TestServer.Controllers {
    [Route("api/[controller]")] // Base route: /api/Diagram
    [ApiController]
    public class DiagramController : ControllerBase { // Switched to ControllerBase for API
        private readonly ILogger<DiagramController> _logger;

        public DiagramController(ILogger<DiagramController> logger) {
            _logger = logger;
        }

        // [HttpGet] maps this action to the base route: /api/Diagram
        [HttpGet]
        public IActionResult GetDiagram() {
            // Note: Directory.GetCurrentDirectory() is the **runtime** folder (usually bin/Debug/net8.0),
            // NOT the project root. Make sure DiagramExamples exists there, or use 
            // IWebHostEnvironment to get the ContentRootPath for more reliable file access.
            string currentFolder = Directory.GetCurrentDirectory() + "\\DiagramExamples";
            string fileName = "CarPartssysmlv2.json";
            string file = Path.Combine(currentFolder, fileName); // Use Path.Combine for better path handling

            try {
                if (!System.IO.File.Exists(file)) {
                    _logger.LogError($"File not found at path: {file}");
                    return NotFound($"Diagram file '{fileName}' not found.");
                }

                string diagramJson = System.IO.File.ReadAllText(file);
                return Ok(diagramJson);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error reading diagram file.");
                return StatusCode(500, "Internal server error reading diagram data.");
            }
        }
    }
}