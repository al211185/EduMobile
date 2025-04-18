// Models/GameScore.cs
namespace EduMobile.Server.Models
{
    public class GameScore
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int CorrectCount { get; set; }    // cuántos acertaron
        public int AttemptCount { get; set; }    // cuántos intentos totales
        public DateTime LastPlayedAt { get; set; }
        public ApplicationUser User { get; set; }
    }
}
