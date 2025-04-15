using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Solo usuarios autenticados
    public class PhaseAssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PhaseAssignmentsController> _logger;

        public PhaseAssignmentsController(ApplicationDbContext context, ILogger<PhaseAssignmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/PhaseAssignments?projectId=xxx
        [HttpGet]
        public async Task<IActionResult> GetAssignments([FromQuery] int projectId)
        {
            // Obtener usuarios del proyecto que no sean profesores
            var teamMembers = await _context.ProjectUsers
                .Include(pu => pu.ApplicationUser)
                .Where(pu => pu.ProjectId == projectId && pu.ApplicationUser.Role != "Profesor")
                .ToListAsync();

            var result = new List<object>();

            foreach (var member in teamMembers)
            {
                var existingAssignment = await _context.PhaseAssignments
                    .FirstOrDefaultAsync(pa => pa.ProjectId == projectId && pa.ApplicationUserId == member.ApplicationUserId);

                if (existingAssignment != null)
                {
                    result.Add(new
                    {
                        existingAssignment.ProjectId,
                        existingAssignment.ApplicationUserId,
                        existingAssignment.AssignedPhase,
                        applicationUserName = $"{member.ApplicationUser.Nombre} {member.ApplicationUser.ApellidoPaterno}"
                    });
                }
                else
                {
                    // Retorna un objeto con assignedPhase = 1 o el valor que quieras por defecto
                    result.Add(new
                    {
                        ProjectId = projectId,
                        ApplicationUserId = member.ApplicationUserId,
                        AssignedPhase = 1,
                        applicationUserName = $"{member.ApplicationUser.Nombre} {member.ApplicationUser.ApellidoPaterno}"
                    });
                }
            }

            return Ok(result);
        }


        // PUT: api/PhaseAssignments?projectId=xxx
        // Recibe una lista de asignaciones de fase para actualizar/crear
        [HttpPut]
        public async Task<IActionResult> UpdateAssignments([FromQuery] int projectId, [FromBody] PhaseAssignmentRequest[] assignments)
        {
            // Obtener el ID del usuario autenticado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // Verifica que el usuario autenticado sea el creador del proyecto:
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
                return NotFound(new { Message = "Proyecto no encontrado." });
            if (project.CreatedById != userId)
                return Unauthorized(new { Message = "No tienes permiso para asignar fases a este proyecto." });

            // Procesa cada asignación enviada
            foreach (var assignment in assignments)
            {
                // Si el integrante no pertenece al equipo, o es un profesor, se omite
                var projectUser = await _context.ProjectUsers
                    .FirstOrDefaultAsync(pu => pu.ProjectId == projectId && pu.ApplicationUserId == assignment.ApplicationUserId);
                if (projectUser == null || (projectUser.ApplicationUser != null && projectUser.ApplicationUser.Role == "Profesor"))
                {
                    continue;
                }

                var existingAssignment = await _context.PhaseAssignments
                    .FirstOrDefaultAsync(pa => pa.ProjectId == projectId && pa.ApplicationUserId == assignment.ApplicationUserId);

                if (existingAssignment != null)
                {
                    existingAssignment.AssignedPhase = (ProjectPhase)assignment.AssignedPhase;
                    _context.PhaseAssignments.Update(existingAssignment);
                }
                else
                {
                    var newAssignment = new PhaseAssignment
                    {
                        ProjectId = projectId,
                        ApplicationUserId = assignment.ApplicationUserId,
                        AssignedPhase = (ProjectPhase)assignment.AssignedPhase
                    };
                    _context.PhaseAssignments.Add(newAssignment);
                }
            }
            await _context.SaveChangesAsync();
            _logger.LogInformation("Asignaciones actualizadas para el proyecto {ProjectId} por el usuario {UserId}.", projectId, userId);
            return Ok(new { Message = "Asignaciones actualizadas correctamente." });
        }
    }

    public class PhaseAssignmentRequest
    {
        public string ApplicationUserId { get; set; }
        public int AssignedPhase { get; set; } // Se convertirá a ProjectPhase en el controlador.
    }
}
