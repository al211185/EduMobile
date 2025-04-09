namespace EduMobile.Server.Models
{
    public class Notification
    {
        public int Id { get; set; }

        // Mensaje de la notificación.
        public string Message { get; set; }

        // Fecha en que se creó la notificación.
        public DateTime CreatedAt { get; set; }

        // Indica si la notificación ya fue leída.
        public bool IsRead { get; set; } = false;

        // Opcional: si deseas asociar la notificación a un usuario específico.
        public string? UserId { get; set; }

        // Propiedad de navegación, siempre y cuando ApplicationUser esté configurado para ello.
        public ApplicationUser User { get; set; }
    }

}
