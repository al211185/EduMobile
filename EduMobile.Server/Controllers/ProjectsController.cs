using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Projects/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
        {
            try
            {
                if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request.Title))
                    return BadRequest(new { Message = "El título es obligatorio." });

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var existingProject = await _context.Projects
                    .AnyAsync(p => p.Title == request.Title && p.CreatedById == userId);

                if (existingProject)
                    return BadRequest(new { Message = "Ya existe un proyecto con este título." });

                var semesterStudent = await _context.SemesterStudents
                    .Include(ss => ss.Semester)
                    .FirstOrDefaultAsync(ss => ss.StudentId == userId);

                if (semesterStudent == null)
                    return BadRequest(new { Message = "No tienes un semestre asignado." });

                var project = new Project
                {
                    Title = request.Title,
                    Description = request.Description ?? "",
                    CreatedById = userId,
                    SemesterId = semesterStudent.SemesterId,
                    CreatedAt = DateTime.UtcNow,
                    CorporateColors = "000000,000000,000000",
                    CorporateFont = "Arial",
                    GeneralObjective = "Por definir",
                    SpecificObjectives = new List<string>(),
                    FunctionalRequirements = new List<string>(),
                    AllowedTechnologies = "[]",
                    CustomTechnologies = "[]",
                    ReflectiveAnswers = "{}",
                    ClienteName = ""
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                // Crear automáticamente un registro en DesignPhases
                var designPhase = new DesignPhase
                {
                    ProjectId = project.Id,
                    SiteMapFilePath = string.Empty,
                    Wireframe480pxPath = string.Empty,
                    Wireframe768pxPath = string.Empty,
                    Wireframe1024pxPath = string.Empty,
                    VisualDesignFilePath = string.Empty,
                    ContentFilePath = string.Empty,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.DesignPhases.Add(designPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Proyecto creado exitosamente.", ProjectId = project.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear proyecto: {ex.Message}");
                Console.WriteLine($"Detalles de la excepción: {ex.InnerException?.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new
                {
                    Message = "Error interno del servidor.",
                    Error = ex.Message,
                    InnerError = ex.InnerException?.Message,
                    Details = ex.StackTrace
                });
            }


        }


        // GET: api/Projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
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

        // GET: api/Projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // ID del usuario autenticado
            var userRole = User.FindFirstValue(ClaimTypes.Role); // Rol del usuario autenticado

            // Buscar el proyecto con las relaciones necesarias
            var project = await _context.Projects
                .Include(p => p.Semester)
                .Include(p => p.CreatedBy)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound(new { Message = "Proyecto no encontrado." });
            }

            // Verificar si el usuario es el creador o tiene el rol "Profesor"
            if (project.CreatedById != userId && userRole != "Profesor")
            {
                return Unauthorized(new { Message = "No tienes permiso para acceder a este proyecto." });
            }

            // Preparar el objeto de respuesta
            var result = new
            {
                project.Id,
                project.Title,
                project.Description,
                project.ClienteName,
                project.StartDate,
                project.GeneralObjective,
                SpecificObjectives = project.SpecificObjectives, // Lista deserializada
                FunctionalRequirements = project.FunctionalRequirements, // Lista deserializada
                CustomRequirements = project.CustomRequirements, // Lista deserializada
                CorporateColors = project.CorporateColors.Split(','), // Separar colores
                project.CorporateFont,
                AllowedTechnologies = !string.IsNullOrEmpty(project.AllowedTechnologies)
                    ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(project.AllowedTechnologies)
                    : new List<string>(),
                CustomTechnologies = !string.IsNullOrEmpty(project.CustomTechnologies)
                    ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(project.CustomTechnologies)
                    : new List<string>(),
                project.ReflectiveAnswers,
                project.CreatedAt,
                project.CurrentPhase,
                SemesterName = project.Semester != null ? project.Semester.Name : "Sin semestre",
                CreatedByName = project.CreatedBy != null
                    ? $"{project.CreatedBy.Nombre} {project.CreatedBy.ApellidoPaterno} {project.CreatedBy.ApellidoMaterno}"
                    : "Usuario desconocido"
            };

            return Ok(result);
        }



        // PUT: api/Projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos inválidos." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.CreatedById == userId);

            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado o no tienes permiso para editarlo." });

            project.Title = request.Title ?? project.Title;
            project.Description = request.Description ?? project.Description;
            project.CurrentPhase = request.CurrentPhase ?? project.CurrentPhase;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Proyecto actualizado exitosamente." });
        }

        // DELETE: api/Projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.CreatedById == userId);

            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado o no tienes permiso para eliminarlo." });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Proyecto eliminado exitosamente." });
        }

        [HttpPost("save-phase-data")]
        public async Task<IActionResult> SavePhaseData([FromBody] ProjectPhaseDataRequest request)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.CreatedBy)
                    .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

                if (project == null)
                    return NotFound(new { Message = "Proyecto no encontrado" });

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (project.CreatedById != userId)
                    return Unauthorized(new { Message = "No tienes permiso para actualizar este proyecto." });

                // Validar campos obligatorios
                if (string.IsNullOrWhiteSpace(request.Title) ||
                    string.IsNullOrWhiteSpace(request.ClienteName) ||
                    string.IsNullOrWhiteSpace(request.Responsable))
                {
                    return BadRequest(new { Message = "Campos obligatorios faltantes." });
                }

                // Actualizar los campos del proyecto
                project.Title = request.Title;
                project.Description = request.Description ?? project.Description;
                project.ClienteName = request.ClienteName;
                project.StartDate = request.StartDate;
                project.GeneralObjective = request.GeneralObjective;
                project.SpecificObjectivesJson = string.Join(";", request.SpecificObjectives ?? new List<string>());
                project.FunctionalRequirementsJson = string.Join(";", request.FunctionalRequirements ?? new List<string>());
                project.CustomRequirementsJson = string.Join(";", request.CustomRequirements ?? new List<string>());
                project.CorporateColors = $"{request.CorporateColors.Primary},{request.CorporateColors.Secondary1},{request.CorporateColors.Secondary2}";
                project.CorporateFont = request.CorporateFont;
                project.ReflectiveAnswers = request.ReflectiveAnswers;

                // Serializar AllowedTechnologies y CustomTechnologies
                project.AllowedTechnologies = request.AllowedTechnologies != null
                    ? System.Text.Json.JsonSerializer.Serialize(request.AllowedTechnologies)
                    : "[]";

                project.CustomTechnologies = request.CustomTechnologies != null
                    ? System.Text.Json.JsonSerializer.Serialize(request.CustomTechnologies)
                    : "[]";

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Datos guardados exitosamente",
                    ProjectId = project.Id,
                    CurrentPhase = project.CurrentPhase
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al guardar datos de la fase: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        [HttpGet("all-projects")]
        [Authorize(Roles = "Profesor")]
        public IActionResult GetAllProjects()
        {
            var projects = _context.Projects
                .Include(p => p.Semester)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    SemesterName = p.Semester != null ? p.Semester.Name : "Sin Semestre",
                    CreatedBy = p.CreatedBy != null ? p.CreatedBy.Nombre : "Desconocido"
                })
                .ToList();

            return Ok(projects);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentProject()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { Message = "Usuario no autenticado." });
            }

            // Busca el proyecto actual del usuario
            var project = await _context.Projects
                .Include(p => p.Semester)
                .Where(p => p.CreatedById == userId)
                .OrderByDescending(p => p.CreatedAt) // Opcional: Obtén el más reciente si hay varios
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound(new { Message = "No se encontró un proyecto asignado al usuario." });
            }

            return Ok(new
            {
                project.Id,
                project.Title,
                project.Description,
                project.CurrentPhase,
                SemesterName = project.Semester != null ? project.Semester.Name : "Sin Semestre"
            });
        }



    }

    public class CreateProjectRequest
    {
        [Required]
        public string Title { get; set; } // Obligatorio

        public string Description { get; set; } // Opcional
    }




    public class UpdateProjectRequest
    {
        public int ProjectId { get; set; } // Para identificar el proyecto que se actualizará
        public string Title { get; set; } // Opcional, con validación de longitud

        public string Description { get; set; } // Opcional, con validación de longitud

        public int? CurrentPhase { get; set; } // Puede ser nulo para evitar cambios en esta propiedad
    }

    public class ProjectPhaseDataRequest
    {
        public int ProjectId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string ClienteName { get; set; }

        public string Responsable { get; set; }

        public DateTime StartDate { get; set; }

        public string GeneralObjective { get; set; }

        public List<string> SpecificObjectives { get; set; } = new List<string>();

        public List<string> FunctionalRequirements { get; set; } = new List<string>();

        public List<string> CustomRequirements { get; set; } = new List<string>();

        public List<string> AllowedTechnologies { get; set; }

        public List<string> CustomTechnologies { get; set; }

        public CorporateColors CorporateColors { get; set; }

        public string CorporateFont { get; set; }

        public string Description { get; set; }

        public string ReflectiveAnswers { get; set; }
    }




    public class CorporateColors
    {
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "El color primario debe ser un código hexadecimal válido.")]
        public string Primary { get; set; } = "#000000";

        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "El color secundario 1 debe ser un código hexadecimal válido.")]
        public string Secondary1 { get; set; } = "#000000";

        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "El color secundario 2 debe ser un código hexadecimal válido.")]
        public string Secondary2 { get; set; } = "#000000";
    }

}
