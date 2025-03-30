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
    [Authorize] // Solo usuarios autenticados pueden acceder
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
        // Crea un nuevo proyecto con los datos esenciales, junto con sus fases y tarjetas, usando una transacción
        [HttpPost("create")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { Message = "El título es obligatorio." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Verificar que no exista ya un proyecto con el mismo título para este usuario
                    bool exists = await _context.Projects.AnyAsync(p => p.Title == request.Title && p.CreatedById == userId);
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
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Proyecto '{Title}' creado por el usuario {UserId}.", project.Title, userId);

                    var projectUser = new ProjectUser
                    {
                        ProjectId = project.Id,
                        ApplicationUserId = userId,
                        RoleInProject = "Creador",
                        JoinedAt = DateTime.UtcNow
                    };
                    _context.ProjectUsers.Add(projectUser);
                    await _context.SaveChangesAsync();


                    // Crear la fase de planeación
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

                    // Crear la fase de diseño con valores por defecto
                    var designPhase = new DesignPhase
                    {
                        ProjectId = project.Id,
                        SiteMapFilePath = "",
                        IsHierarchyClear = false,
                        AreSectionsIdentified = false,
                        AreLinksClear = false,
                        AreVisualElementsUseful = false,
                        Wireframe480pxPath = "",
                        Wireframe768pxPath = "",
                        Wireframe1024pxPath = "",
                        IsMobileFirst = false,
                        IsNavigationClear = false,
                        IsDesignFunctional = false,
                        IsVisualConsistencyMet = false,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.DesignPhases.Add(designPhase);
                    await _context.SaveChangesAsync();

                    // Crear la fase de desarrollo (Kanban board) utilizando los campos de backlog de PlanningPhase
                    var developmentPhase = new DevelopmentPhase
                    {
                        ProjectId = project.Id,
                        AllowedTechnologies = planningPhase.AllowedTechnologies,
                        CustomTechnologies = planningPhase.CustomTechnologies,
                        FunctionalRequirements = planningPhase.FunctionalRequirements,
                        CustomRequirements = planningPhase.CustomRequirements,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.DevelopmentPhases.Add(developmentPhase);
                    await _context.SaveChangesAsync();

                    // Procesar y crear las tarjetas (KanbanItems)
                    var backlogItems = new List<string>();

                    if (!string.IsNullOrWhiteSpace(planningPhase.AllowedTechnologies))
                    {
                        backlogItems.AddRange(planningPhase.AllowedTechnologies.Split(",")
                            .Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)));
                    }

                    if (!string.IsNullOrWhiteSpace(planningPhase.CustomTechnologies))
                    {
                        backlogItems.AddRange(planningPhase.CustomTechnologies.Split(",")
                            .Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)));
                    }

                    if (!string.IsNullOrWhiteSpace(planningPhase.FunctionalRequirements))
                    {
                        backlogItems.AddRange(planningPhase.FunctionalRequirements.Split(";")
                            .Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)));
                    }

                    if (!string.IsNullOrWhiteSpace(planningPhase.CustomRequirements))
                    {
                        backlogItems.AddRange(planningPhase.CustomRequirements.Split(";")
                            .Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)));
                    }

                    foreach (var item in backlogItems)
                    {
                        var kanbanItem = new KanbanItem
                        {
                            Title = item,
                            Description = "",
                            Status = "Backlog",
                            Order = 0,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            DevelopmentPhaseId = developmentPhase.Id
                        };
                        _context.KanbanItems.Add(kanbanItem);
                    }

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return Ok(new { Message = "Proyecto creado exitosamente.", ProjectId = project.Id });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error al crear el proyecto");
                    return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
                }
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
                    .Where(p => p.CreatedById == userId || p.ProjectUsers.Any(pu => pu.ApplicationUserId == userId))
                    .Include(p => p.CreatedBy)
                    .Include(p => p.ProjectUsers)
                        .ThenInclude(pu => pu.ApplicationUser)
                    .Include(p => p.Semester)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Description,
                        p.CreatedAt,
                        p.CurrentPhase,
                        semesterName = p.Semester != null ? p.Semester.Name : "Sin semestre",
                        createdBy = p.CreatedBy != null ? $"{p.CreatedBy.Nombre} {p.CreatedBy.ApellidoPaterno}" : "Desconocido",
                        team = p.ProjectUsers.Select(pu => new {
                            pu.ApplicationUserId,
                            name = pu.ApplicationUser != null
                                   ? $"{pu.ApplicationUser.Nombre} {pu.ApplicationUser.ApellidoPaterno}"
                                   : ""
                        }).ToList()

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
                    .Include(p => p.ProjectUsers)  // Incluir colaboradores
                        .ThenInclude(pu => pu.ApplicationUser)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado." });
                }

                // Validar que el usuario tenga permiso para ver el proyecto:
                // El usuario debe ser el creador o estar en la lista de colaboradores
                bool isCreator = project.CreatedById == userId;
                bool isCollaborator = project.ProjectUsers.Any(pu => pu.ApplicationUserId == userId);
                if (!isCreator && !isCollaborator)
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
                    CreatedByName = project.CreatedBy != null ? $"{project.CreatedBy.Nombre} {project.CreatedBy.ApellidoPaterno}" : "Desconocido",
                    CreatedById = project.CreatedById // Agrega esta propiedad
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

        // POST: api/Projects/{projectId}/team/add
        // Agrega un colaborador al proyecto buscando por correo electrónico
        [HttpPost("{projectId}/team/add")]
        public async Task<IActionResult> AddCollaborator(int projectId, [FromBody] AddCollaboratorRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .Include(p => p.ProjectUsers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado." });

            if (project.CreatedById != userId)
                return Unauthorized(new { Message = "No tienes permiso para agregar colaboradores a este proyecto." });

            // Buscar al usuario por email
            var collaborator = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.CollaboratorEmail);
            if (collaborator == null)
                return NotFound(new { Message = "Usuario a agregar no encontrado." });

            bool alreadyAdded = project.ProjectUsers.Any(pu => pu.ApplicationUserId == collaborator.Id);
            if (alreadyAdded)
                return BadRequest(new { Message = "El usuario ya es colaborador de este proyecto." });

            var projectUser = new ProjectUser
            {
                ProjectId = projectId,
                ApplicationUserId = collaborator.Id,
                RoleInProject = request.RoleInProject ?? "Colaborador"
            };

            _context.ProjectUsers.Add(projectUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Colaborador agregado correctamente." });
        }

        // GET: api/Projects/{projectId}/team
        // Lista los colaboradores del proyecto.
        [HttpGet("{projectId}/team")]
        public async Task<IActionResult> GetTeamMembers(int projectId)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectUsers)
                    .ThenInclude(pu => pu.ApplicationUser)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado." });

            var team = project.ProjectUsers.Select(pu => new
            {
                pu.ApplicationUserId,
                pu.ApplicationUser.Nombre,
                pu.ApplicationUser.ApellidoPaterno,
                pu.RoleInProject,
                pu.JoinedAt
            });

            return Ok(team);
        }

        // DELETE: api/Projects/{projectId}/team/{collaboratorId}
        // Elimina un colaborador del proyecto.
        [HttpDelete("{projectId}/team/{collaboratorId}")]
        public async Task<IActionResult> RemoveCollaborator(int projectId, string collaboratorId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .Include(p => p.ProjectUsers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado." });

            if (project.CreatedById != userId)
                return Unauthorized(new { Message = "No tienes permiso para eliminar colaboradores de este proyecto." });

            var projectUser = project.ProjectUsers.FirstOrDefault(pu => pu.ApplicationUserId == collaboratorId);
            if (projectUser == null)
                return NotFound(new { Message = "El colaborador no está asignado a este proyecto." });

            _context.ProjectUsers.Remove(projectUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Colaborador eliminado del proyecto." });
        }

        //profesores
        // GET: api/Projects/all-projects?semesterId=1
        [HttpGet("all-projects")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetAllProjects([FromQuery] int? semesterId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Filtra solo los proyectos en los que el usuario está incluido como "Profesor"
                var projectsQuery = _context.Projects
                    .Include(p => p.Semester)
                    .Include(p => p.CreatedBy)
                    .Include(p => p.ProjectUsers)
                        .ThenInclude(pu => pu.ApplicationUser)
                    .Where(p => p.ProjectUsers.Any(pu => pu.ApplicationUserId == userId
                                                         && pu.RoleInProject == "Profesor"));

                // Si se envía un semesterId válido (> 0), se filtra por ese semestre.
                if (semesterId.HasValue && semesterId.Value > 0)
                {
                    projectsQuery = projectsQuery.Where(p => p.SemesterId == semesterId.Value);
                }

                var projects = await projectsQuery.ToListAsync();

                var result = projects.Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.CreatedAt,
                    p.CurrentPhase,
                    semesterName = p.Semester != null ? p.Semester.Name : "Sin semestre",
                    createdBy = p.CreatedBy != null ? $"{p.CreatedBy.Nombre} {p.CreatedBy.ApellidoPaterno}" : "Desconocido",
                    team = p.ProjectUsers.Select(pu => new
                    {
                        pu.ApplicationUserId,
                        name = pu.ApplicationUser != null
                                 ? $"{pu.ApplicationUser.Nombre} {pu.ApplicationUser.ApellidoPaterno}"
                                 : "",
                        pu.RoleInProject,
                        pu.JoinedAt
                    })
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener proyectos para el profesor.");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }



        // GET: api/Projects/professor/{id}
        // Este endpoint permite que un profesor (con rol "Profesor") obtenga los detalles completos de un proyecto,
        // incluyendo el semestre, el creador y la lista de colaboradores (team).
        [HttpGet("professor/{id}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetProjectDetailsForProfessor(int id)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Semester)
                    .Include(p => p.CreatedBy)
                    .Include(p => p.ProjectUsers)
                        .ThenInclude(pu => pu.ApplicationUser)
                    .Include(p => p.PlanningPhase)    // Incluir fase de planeación
                    .Include(p => p.DesignPhases)       // Incluir fase de diseño
                    .Include(p => p.DevelopmentPhase)  // Incluir fase de desarrollo
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado." });
                }

                var result = new
                {
                    project.Id,
                    project.Title,
                    project.Description,
                    project.CreatedAt,
                    project.CurrentPhase,
                    Semester = project.Semester != null ? new
                    {
                        project.Semester.Id,
                        project.Semester.Name,
                        project.Semester.Year,
                        project.Semester.Period
                    } : null,
                    CreatedBy = project.CreatedBy != null ? new
                    {
                        project.CreatedBy.Id,
                        project.CreatedBy.Nombre,
                        project.CreatedBy.ApellidoPaterno,
                        project.CreatedBy.ApellidoMaterno,
                        project.CreatedBy.Email
                    } : null,
                    Team = project.ProjectUsers.Select(pu => new
                    {
                        pu.ApplicationUserId,
                        Name = pu.ApplicationUser != null ? $"{pu.ApplicationUser.Nombre} {pu.ApplicationUser.ApellidoPaterno}" : "",
                        pu.RoleInProject,
                        pu.JoinedAt
                    }),
                    PlanningPhase = project.PlanningPhase,   // Devuelve toda la información de planeación
                    DesignPhase = project.DesignPhases,         // Devuelve toda la información de diseño
                    DevelopmentPhase = project.DevelopmentPhase, // Devuelve toda la información de desarrollo
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener detalles del proyecto para profesor con id {ProjectId}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }
    }

    // Modelos de solicitud
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

    public class AddCollaboratorRequest
    {
        [Required]
        public string CollaboratorEmail { get; set; }
        public string RoleInProject { get; set; }
    }
}
