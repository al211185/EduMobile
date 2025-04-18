using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        // Devuelve las notificaciones del usuario autenticado.
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var notifications = await _context.Notifications
                                     .Where(n => n.UserId == userId)
                                     .ToListAsync();
            return Ok(notifications);
        }

        // Marca como leída la notificación con el ID indicado.
        // PUT: api/Notifications/{id}/read
        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
                return NotFound(new { Message = "Notificación no encontrada." });

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            // Devuelves la notificación actualizada
            return Ok(notification);
        }


        // DELETE: api/Notifications/{id}
        // Elimina la notificación con el ID indicado para el usuario autenticado.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
            {
                return NotFound(new { Message = "Notificación no encontrada." });
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Notificación eliminada." });
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
        {
            // Opcionalmente puedes validar aquí que el usuario autenticado tenga permisos
            var notification = new Notification
            {
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Devuelve 201 con la notificación creada
            return CreatedAtAction(
                nameof(GetNotifications),
                new { /* no necesitas id aquí para el listado */ },
                notification
            );
        }
    }
}

public class CreateNotificationDto
{
    public string UserId { get; set; }
    public string Message { get; set; }
}
