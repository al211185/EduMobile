using EduMobile.Server.Data;
using EduMobile.Server.Models;
using EduMobile.Server.Services; // Asegúrate de que la ruta del namespace sea la correcta.
using EduMobile.Server.Hubs;       // Asegúrate de que la ruta del namespace sea la correcta.
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FeedbacksController> _logger;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public FeedbacksController(ApplicationDbContext context,
                                   ILogger<FeedbacksController> logger,
                                   INotificationService notificationService,
                                   IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
            _hubContext = hubContext;
        }

        /// <summary>
        /// Obtiene la retroalimentación para un proyecto y fase específicos.
        /// GET: api/Feedbacks/{projectId}/{phase}
        /// </summary>
        [HttpGet("{projectId}/{phase}")]
        public async Task<IActionResult> GetFeedback(int projectId, int phase)
        {
            try
            {
                _logger.LogInformation("Obteniendo retroalimentación para ProjectId {ProjectId} y Phase {Phase}", projectId, phase);
                var feedback = await _context.TeacherFeedbacks
                    .FirstOrDefaultAsync(f => f.ProjectId == projectId && f.Phase == phase);

                // Ahora
                if (feedback == null)
                {
                    _logger.LogWarning("No se encontró retroalimentación para ProjectId {ProjectId} y Phase {Phase}", projectId, phase);
                    // Retorna 404 para que el cliente sepa que debe POST en vez de PUT
                    return NotFound();
                }

                _logger.LogInformation("Retroalimentación obtenida correctamente para ProjectId {ProjectId} y Phase {Phase}", projectId, phase);
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la retroalimentación para ProjectId {ProjectId} y Phase {Phase}", projectId, phase);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        /// <summary>
        /// Crea una nueva retroalimentación de profesor.
        /// POST: api/Feedbacks
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] TeacherFeedback feedback)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos inválidos recibidos para crear retroalimentación.");
                    return BadRequest(new { Message = "Datos inválidos." });
                }

                // Asignar fechas y agregar feedback a la base de datos
                feedback.CreatedAt = DateTime.UtcNow;
                feedback.UpdatedAt = DateTime.UtcNow;
                _logger.LogInformation("Agregando retroalimentación para ProjectId {ProjectId} en la fase {Phase}.", feedback.ProjectId, feedback.Phase);
                _context.TeacherFeedbacks.Add(feedback);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Retroalimentación creada con ID {FeedbackId}.", feedback.Id);

                // Construir el mensaje de notificación
                var subject = $"Nueva retroalimentación - Fase {feedback.Phase}";
                var message = $"Se ha recibido nueva retroalimentación: {feedback.FeedbackText}";
                _logger.LogInformation("Enviando notificación por correo: Subject: {Subject}, Message: {Message}", subject, message);
                await _notificationService.SendTeamNotificationAsync(feedback.ProjectId, subject, message);

                // GUARDAR LAS NOTIFICACIONES EN LA BASE DE DATOS PARA LOS ALUMNOS (excluyendo al profesor)
                var studentUserIds = await _context.ProjectUsers
                    .Where(pu => pu.ProjectId == feedback.ProjectId && pu.ApplicationUser.Role != "Profesor")
                    .Select(pu => pu.ApplicationUserId)
                    .ToListAsync();

                foreach (var studentId in studentUserIds)
                {
                    var notification = new Notification
                    {
                        Message = message,
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        UserId = studentId // Se asigna el ID del alumno
                    };
                    _context.Notifications.Add(notification);
                }
                await _context.SaveChangesAsync();
                _logger.LogInformation("Notificaciones guardadas para {Count} alumnos.", studentUserIds.Count);

                // Notificar en tiempo real a través de SignalR
                _logger.LogInformation("Enviando notificación en tiempo real a través de SignalR: {Message}", message);
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
                _logger.LogInformation("Notificación en tiempo real enviada correctamente.");

                return Ok(new { Message = "Retroalimentación creada exitosamente.", FeedbackId = feedback.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear retroalimentación para el proyecto {ProjectId} en la fase {Phase}", feedback.ProjectId, feedback.Phase);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Actualiza la retroalimentación existente.
        /// PUT: api/Feedbacks/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, [FromBody] TeacherFeedback updatedFeedback)
        {
            try
            {
                _logger.LogInformation("Actualizando retroalimentación con ID {Id}.", id);
                var feedback = await _context.TeacherFeedbacks.FindAsync(id);
                if (feedback == null)
                {
                    _logger.LogWarning("Retroalimentación no encontrada para el ID {Id}.", id);
                    return NotFound(new { Message = "Retroalimentación no encontrada." });
                }

                feedback.FeedbackText = updatedFeedback.FeedbackText;
                feedback.UpdatedAt = DateTime.UtcNow;
                _context.TeacherFeedbacks.Update(feedback);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Retroalimentación con ID {Id} actualizada correctamente.", id);

                // Construir el mensaje de notificación
                var subject = $"Retroalimentación actualizada - Fase {feedback.Phase}";
                var message = $"La retroalimentación se ha actualizado: {feedback.FeedbackText}";
                _logger.LogInformation("Enviando notificación por correo: Subject: {Subject}, Message: {Message}", subject, message);
                await _notificationService.SendTeamNotificationAsync(feedback.ProjectId, subject, message);

                // GUARDAR LAS NOTIFICACIONES EN LA BASE DE DATOS PARA LOS ALUMNOS (excluyendo al profesor)
                var studentUserIds = await _context.ProjectUsers
                    .Where(pu => pu.ProjectId == feedback.ProjectId && pu.ApplicationUser.Role != "Profesor")
                    .Select(pu => pu.ApplicationUserId)
                    .ToListAsync();

                foreach (var studentId in studentUserIds)
                {
                    var notification = new Notification
                    {
                        Message = message,
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        UserId = studentId
                    };
                    _context.Notifications.Add(notification);
                }
                await _context.SaveChangesAsync();
                _logger.LogInformation("Notificaciones actualizadas y guardadas para {Count} alumnos.", studentUserIds.Count);

                // Notificar en tiempo real a través de SignalR
                _logger.LogInformation("Enviando notificación en tiempo real a través de SignalR: {Message}", message);
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
                _logger.LogInformation("Notificación en tiempo real enviada correctamente para la retroalimentación con ID {Id}.", id);

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la retroalimentación con ID {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/Feedbacks/project/{projectId}
        // Devuelve **todas** las retroalimentaciones de un proyecto
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetAllFeedbackForProject(int projectId)
        {
            try
            {
                var list = await _context.TeacherFeedbacks
                    .Where(f => f.ProjectId == projectId)
                    .OrderBy(f => f.Phase)              // opcional: ordena por fase
                    .ThenBy(f => f.CreatedAt)
                    .ToListAsync();

                if (!list.Any())
                    return NotFound(new { Message = "No hay retroalimentación para este proyecto." });

                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todas las retroalimentaciones para el proyecto {ProjectId}", projectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

    }
}
