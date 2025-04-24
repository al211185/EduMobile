using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PhasesController> _logger;

        public PhasesController(ApplicationDbContext context, ILogger<PhasesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/Phases/create
        [HttpPost("create")]
        public async Task<IActionResult> CreatePhase([FromBody] CreatePhaseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos inválidos." });

            try
            {
                var project = await _context.Projects.FindAsync(request.ProjectId);
                if (project == null)
                    return NotFound(new { Message = "Proyecto no encontrado." });

                var phase = new Phase
                {
                    ProjectId = request.ProjectId,
                    PhaseNumber = request.PhaseNumber,
                    Data = request.Data,
                    CreatedAt = DateTime.UtcNow  // Se asigna la fecha de creación
                };

                _context.Phases.Add(phase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase creada exitosamente.", PhaseId = phase.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear fase para el proyecto {ProjectId}", request.ProjectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/Phases/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhase(int id, [FromBody] UpdatePhaseRequest request)
        {
            try
            {
                var phase = await _context.Phases.FindAsync(id);
                if (phase == null)
                    return NotFound(new { Message = "Fase no encontrada." });

                // Actualiza la data solo si se proporciona nueva información
                phase.Data = request.Data ?? phase.Data;
                // Se asume que la entidad Phase tiene una propiedad UpdatedAt para la fecha de actualización
                phase.UpdatedAt = DateTime.UtcNow;

                _context.Phases.Update(phase);


                // 2️⃣ También marca el Proyecto como “editado ahora”
                var project = await _context.Projects.FindAsync(phase.ProjectId);
                if (project != null)
                {
                    project.UpdatedAt = DateTime.UtcNow;
                    _context.Projects.Update(project);
                }

                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase actualizada exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar fase con id {PhaseId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Phases/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetPhasesByProject(int projectId)
        {
            try
            {
                var phases = await _context.Phases
                    .Where(p => p.ProjectId == projectId)
                    .OrderBy(p => p.PhaseNumber)
                    .Select(p => new
                    {
                        p.Id,
                        p.PhaseNumber,
                        p.Data,
                        p.CreatedAt,
                        p.UpdatedAt
                    })
                    .ToListAsync();

                if (phases == null || !phases.Any())
                    return NotFound(new { Message = "No se encontraron fases para este proyecto." });

                return Ok(phases);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener fases para el proyecto {ProjectId}", projectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Phases/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhaseById(int id)
        {
            try
            {
                var phase = await _context.Phases
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        p.Id,
                        p.PhaseNumber,
                        p.Data,
                        p.CreatedAt,
                        p.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (phase == null)
                    return NotFound(new { Message = "Fase no encontrada." });

                return Ok(phase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener detalles de la fase con id {PhaseId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }
    }

    public class CreatePhaseRequest
    {
        public int ProjectId { get; set; }
        public int PhaseNumber { get; set; }
        public string Data { get; set; } // Información de la fase en formato JSON
    }

    public class UpdatePhaseRequest
    {
        public string Data { get; set; } // Información de la fase actualizada
    }
}
