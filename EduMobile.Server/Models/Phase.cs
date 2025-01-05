using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduMobile.Server.Models
{
    public class Phase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; } // Relación con el proyecto
        public Project Project { get; set; }

        [Required]
        public int PhaseNumber { get; set; } // Número de la fase (1, 2, etc.)

        public string Data { get; set; } // Información de la fase en formato JSON

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
