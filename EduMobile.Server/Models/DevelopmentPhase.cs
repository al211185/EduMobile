// Models/DevelopmentPhase.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Models
{
    public class DevelopmentPhase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        // Campos tomados de PlanningPhase para el backlog del Kanban Board
        public string AllowedTechnologies { get; set; } = "";
        public string CustomTechnologies { get; set; } = "";
        public string FunctionalRequirements { get; set; } = "";
        public string CustomRequirements { get; set; } = "";

        // Colección de tareas (tarjetas) del Kanban board
        public ICollection<KanbanItem> KanbanItems { get; set; } = new List<KanbanItem>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
