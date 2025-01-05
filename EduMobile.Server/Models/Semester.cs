using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Models
{
    public class Semester
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        [MaxLength(1)]
        public string Period { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

        [Required]
        public string ProfessorId { get; set; }

        public ApplicationUser Professor { get; set; }

        [Required]
        [MaxLength(50)]
        public string Course { get; set; } // "html-css-basic" o "html-css-advanced"

        // Relación con los estudiantes registrados
        public ICollection<SemesterStudent> SemesterStudents { get; set; } = new List<SemesterStudent>();

        // Relación con los proyectos asociados al semestre
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
