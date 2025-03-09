using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduMobile.Server.Models
{
    using EduMobile.Server.Models;
    using System.ComponentModel.DataAnnotations;

    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        // ... (listado de requirements y corporate styles) ...
        // ... (reflectiveAnswers)...

        [Required]
        public int CurrentPhase { get; set; } = 1;

        // Relación con la fase de planeación
        public PlanningPhase PlanningPhase { get; set; }

        // Otras relaciones como DesignPhases, etc.
        public ICollection<DesignPhase> DesignPhases { get; set; } = new List<DesignPhase>();

        public string? CreatedById { get; set; }
        public ApplicationUser? CreatedBy { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? SemesterId { get; set; }
        public Semester Semester { get; set; }
    }

}