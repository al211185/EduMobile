namespace EduMobile.Server.Models
{
    public class ProjectUser
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        // Puedes agregar campos extra si quieres
        public string RoleInProject { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }

}
