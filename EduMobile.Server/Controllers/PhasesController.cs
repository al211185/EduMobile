using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PhasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Phases/create
        [HttpPost("create")]
        public async Task<IActionResult> CreatePhase([FromBody] CreatePhaseRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { Message = "Datos inválidos." });

                var project = await _context.Projects.FindAsync(request.ProjectId);
                if (project == null)
                    return NotFound(new { Message = "Proyecto no encontrado." });

                var phase = new Phase
                {
                    ProjectId = request.ProjectId,
                    PhaseNumber = request.PhaseNumber,
                    Data = request.Data
                };

                _context.Phases.Add(phase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase creada exitosamente.", PhaseId = phase.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear fase: {ex.Message}");
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

                phase.Data = request.Data ?? phase.Data;
                phase.CreatedAt = DateTime.UtcNow;

                _context.Phases.Update(phase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase actualizada exitosamente." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar fase: {ex.Message}");
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
                        p.CreatedAt
                    })
                    .ToListAsync();

                if (phases == null || !phases.Any())
                    return NotFound(new { Message = "No se encontraron fases para este proyecto." });

                return Ok(phases);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener fases: {ex.Message}");
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
                        p.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (phase == null)
                    return NotFound(new { Message = "Fase no encontrada." });

                return Ok(phase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener detalles de la fase: {ex.Message}");
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
