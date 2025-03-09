using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(ApplicationDbContext context, ILogger<ProjectsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/Projects/create
        // Crea un nuevo proyecto con los datos esenciales.
        [HttpPost("create")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { Message = "El título es obligatorio." });
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Verificar que no exista ya un proyecto con el mismo título para este usuario
                bool exists = await _context.Projects
                    .AnyAsync(p => p.Title == request.Title && p.CreatedById == userId);
                if (exists)
                {
                    return BadRequest(new { Message = "Ya existe un proyecto con este título." });
                }

                // Se asume que el usuario tiene un semestre asignado
                var semesterStudent = await _context.SemesterStudents
                    .Include(ss => ss.Semester)
                    .FirstOrDefaultAsync(ss => ss.StudentId == userId);
                if (semesterStudent == null)
                {
                    return BadRequest(new { Message = "No tienes un semestre asignado." });
                }

                // Crear el proyecto
                var project = new Project
                {
                    Title = request.Title,
                    Description = request.Description ?? string.Empty,
                    CreatedById = userId,
                    SemesterId = semesterStudent.SemesterId,
                    CreatedAt = DateTime.UtcNow,
                    CurrentPhase = 1
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync(); // Guarda el proyecto y asigna su ID

                // Crear el registro en PlanningPhases para este proyecto, usando el ID asignado
                var planningPhase = new PlanningPhase
                {
                    ProjectId = project.Id,
                    ProjectName = project.Title,
                    ClienteName = "",
                    Responsable = "",
                    StartDate = DateTime.UtcNow,
                    GeneralObjective = "",
                    SpecificObjectives = "",
                    FunctionalRequirements = "",
                    CustomRequirements = "",
                    CorporateColors = "#000000,#000000,#000000",
                    CorporateFont = "Arial",
                    AllowedTechnologies = "",
                    CustomTechnologies = "",
                    ReflectionPhase1 = "",
                    BenchmarkObjective = "",
                    BenchmarkSector = "",
                    BenchmarkResponsableF2 = "",
                    Competitor1Name = "",
                    Competitor1ScreenshotPath = "",
                    Competitor1Url = "",
                    Competitor1Positives = "",
                    Competitor1Negatives = "",
                    Competitor1EaseOfUse = 0,
                    Competitor1Difficulties = "",
                    Competitor1UsefulFeatures = "",
                    Competitor2Name = "",
                    Competitor2ScreenshotPath = "",
                    Competitor2Url = "",
                    Competitor2Positives = "",
                    Competitor2Negatives = "",
                    Competitor2EaseOfUse = 0,
                    Competitor2Difficulties = "",
                    Competitor2UsefulFeatures = "",
                    BenchmarkFindings = "",
                    BenchmarkImprovements = "",
                    BenchmarkUsedSmartphoneForScreens = false,
                    BenchmarkUsedSmartphoneForComparative = false,
                    BenchmarkConsideredMobileFirst = false,
                    ReflectionPhase2 = "",
                    AudienceQuestions = "",
                    ReflectionPhase3 = "",
                    UpdatedAt = DateTime.UtcNow
                };

                _context.PlanningPhases.Add(planningPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Proyecto creado exitosamente.", ProjectId = project.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el proyecto");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Projects
        // Lista los proyectos creados por el usuario autenticado.
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var projects = await _context.Projects
                    .Where(p => p.CreatedById == userId)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Description,
                        p.CreatedAt,
                        p.CurrentPhase,
                        SemesterName = p.Semester != null ? p.Semester.Name : "Sin semestre"
                    })
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener proyectos");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Projects/{id}
        // Obtiene la información detallada de un proyecto.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var project = await _context.Projects
                    .Include(p => p.Semester)
                    .Include(p => p.CreatedBy)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado." });
                }

                // Validar que el usuario tenga permiso para ver el proyecto
                if (project.CreatedById != userId)
                {
                    return Unauthorized(new { Message = "No tienes permiso para acceder a este proyecto." });
                }

                var result = new
                {
                    project.Id,
                    project.Title,
                    project.Description,
                    project.CreatedAt,
                    project.CurrentPhase,
                    SemesterName = project.Semester != null ? project.Semester.Name : "Sin semestre",
                    CreatedByName = project.CreatedBy != null ? $"{project.CreatedBy.Nombre} {project.CreatedBy.ApellidoPaterno}" : "Desconocido"
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el proyecto con id {ProjectId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/Projects/{id}
        // Actualiza los datos básicos del proyecto.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Datos inválidos." });
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.CreatedById == userId);

                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado o no tienes permiso para editarlo." });
                }

                project.Title = request.Title ?? project.Title;
                project.Description = request.Description ?? project.Description;
                if (request.CurrentPhase.HasValue)
                {
                    project.CurrentPhase = request.CurrentPhase.Value;
                }

                _context.Projects.Update(project);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Proyecto actualizado exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el proyecto con id {ProjectId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // DELETE: api/Projects/{id}
        // Elimina un proyecto del usuario autenticado.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.CreatedById == userId);

                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado o no tienes permiso para eliminarlo." });
                }

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Proyecto eliminado exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el proyecto con id {ProjectId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Projects/current
        // Retorna el proyecto más reciente del usuario autenticado.
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentProject()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var project = await _context.Projects
                    .Include(p => p.Semester)
                    .Where(p => p.CreatedById == userId)
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefaultAsync();

                if (project == null)
                {
                    return NotFound(new { Message = "No se encontró un proyecto asignado al usuario." });
                }

                var result = new
                {
                    project.Id,
                    project.Title,
                    project.Description,
                    project.CreatedAt,
                    project.CurrentPhase,
                    SemesterName = project.Semester != null ? project.Semester.Name : "Sin semestre"
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el proyecto actual");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }
    }

    // Modelos de solicitud sin la propiedad GeneralObjective, ya que ahora se maneja en PlanningPhase.
    public class CreateProjectRequest
    {
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateProjectRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? CurrentPhase { get; set; }
    }
}
