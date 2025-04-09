using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Models
{
    public class TeacherFeedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }

        /// <summary>
        /// Número de fase (1: Planeación, 2: Diseño, 3: Desarrollo, 4: Evaluación)
        /// </summary>
        [Required]
        public int Phase { get; set; }

        [Required]
        public string FeedbackText { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
