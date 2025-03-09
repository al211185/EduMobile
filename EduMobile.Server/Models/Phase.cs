using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduMobile.Server.Models
{
    public class Phase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Project))]
        public int ProjectId { get; set; }

        // Propiedad virtual para habilitar lazy loading si se configura en el contexto.
        public virtual Project Project { get; set; }

        [Required]
        public int PhaseNumber { get; set; } // Número de la fase (1, 2, etc.)

        // Información de la fase en formato JSON. Puedes especificar un tipo de columna si tu motor de base de datos lo permite.
        public string Data { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Propiedad opcional para registrar la última actualización.
        public DateTime? UpdatedAt { get; set; }
    }
}