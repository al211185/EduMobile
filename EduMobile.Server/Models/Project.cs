using EduMobile.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Project
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    public DateTime StartDate { get; set; }

    public string GeneralObjective { get; set; }

    [NotMapped]
    public List<string> SpecificObjectives { get; set; } = new List<string>();

    [NotMapped]
    public List<string> FunctionalRequirements { get; set; } = new List<string>();

    [NotMapped]
    public List<string> CustomRequirements { get; set; } = new List<string>();

    [Required]
    public string CorporateColors { get; set; } = "000000,000000,000000";

    public string CorporateFont { get; set; }

    public string AllowedTechnologies { get; set; } // JSON serializado para tecnologías permitidas

    public string CustomTechnologies { get; set; } // JSON serializado para tecnologías personalizadas

    public string ReflectiveAnswers { get; set; }

    public string ClienteName { get; set; }

    public string? CreatedById { get; set; } // Ahora opcional
    public ApplicationUser? CreatedBy { get; set; } // También opcional

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public int CurrentPhase { get; set; } = 1;

    public int? SemesterId { get; set; }
    public Semester Semester { get; set; }

    [Required]
    public string SpecificObjectivesJson
    {
        get => string.Join(";", SpecificObjectives);
        set => SpecificObjectives = value?.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();
    }

    [Required]
    public string FunctionalRequirementsJson
    {
        get => string.Join(";", FunctionalRequirements);
        set => FunctionalRequirements = value?.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();
    }

    [Required]
    public string CustomRequirementsJson
    {
        get => string.Join(";", CustomRequirements);
        set => CustomRequirements = value?.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();
    }
}
