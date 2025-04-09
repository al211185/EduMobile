using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace EduMobile.Server.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation("Cliente conectado: {ConnectionId}", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        // Método opcional que el cliente puede llamar
        public async Task SendNotification(string message)
        {
            _logger.LogInformation("Enviando notificación: {Message}", message);
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
