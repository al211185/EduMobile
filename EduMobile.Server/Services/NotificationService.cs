using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;

        public NotificationService(ApplicationDbContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        public async Task SendTeamNotificationAsync(int projectId, string subject, string message)
        {
            // Suponiendo que la entidad ProjectUser relaciona el proyecto y el usuario
            // y que el campo ApplicationUser.Role determina si es "Profesor" o "Alumno"
            var teamMembers = await _context.ProjectUsers
                .Include(pu => pu.ApplicationUser)
                .Where(pu => pu.ProjectId == projectId && pu.ApplicationUser.Role != "Profesor")
                .ToListAsync();

            foreach (var member in teamMembers)
            {
                await _emailSender.SendEmailAsync(member.ApplicationUser.Email, subject, message);
            }
        }
    }
}
