using System.Threading.Tasks;

namespace EduMobile.Server.Services
{
    public interface INotificationService
    {
        Task SendTeamNotificationAsync(int projectId, string subject, string message);
    }
}
