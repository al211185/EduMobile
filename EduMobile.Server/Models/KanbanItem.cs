// Models/KanbanItem.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EduMobile.Server.Models
{
    public class KanbanItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DevelopmentPhaseId { get; set; }

        [JsonIgnore] // Esto rompe el ciclo
        public DevelopmentPhase DevelopmentPhase { get; set; }

        [Required]
        public string Title { get; set; } = "";

        public string Description { get; set; } = "";

        [Required]
        public string Status { get; set; } = "Backlog";

        public int Order { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
