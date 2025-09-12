using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduMobile.Server.Models
{
    public class PlanningPhase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Project))]
        public int ProjectId { get; set; }

        public Project Project { get; set; }

        // ========== Fase 1: Brief de Diseño ==========
        [MaxLength(100)]
        public string ProjectName { get; set; }
        [MaxLength(100)]
        public string ClienteName { get; set; }
        [MaxLength(100)]
        public string Responsable { get; set; }
        public DateTime? StartDate { get; set; }

        public string GeneralObjective { get; set; }
        // Por simplicidad, se guarda como string (JSON o separado por ';')
        public string SpecificObjectives { get; set; }

        // Requisitos funcionales y custom requirements en string/JSON
        public string FunctionalRequirements { get; set; }
        public string CustomRequirements { get; set; }

        // Restricciones y preferencias
        public string CorporateColors { get; set; } = "#000000,#000000,#000000";
        public string CorporateFont { get; set; } = string.Empty;
        public string AllowedTechnologies { get; set; }
        public string CustomTechnologies { get; set; }

        // Ejercicio reflexivo Fase 1
        public string ReflectionPhase1 { get; set; }

        // ========== Fase 2: Benchmarking ==========
        public string BenchmarkObjective { get; set; }
        public string BenchmarkSector { get; set; }
        public string BenchmarkResponsableF2 { get; set; }

        // Competidor 1
        public string Competitor1Name { get; set; }
        public string Competitor1ScreenshotPath { get; set; }
        public string Competitor1Url { get; set; }
        public string Competitor1Positives { get; set; }
        public string Competitor1Negatives { get; set; }
        public int Competitor1EaseOfUse { get; set; }
        public string Competitor1Difficulties { get; set; }
        public string Competitor1UsefulFeatures { get; set; }

        // Competidor 2
        public string Competitor2Name { get; set; }
        public string Competitor2ScreenshotPath { get; set; }
        public string Competitor2Url { get; set; }
        public string Competitor2Positives { get; set; }
        public string Competitor2Negatives { get; set; }
        public int Competitor2EaseOfUse { get; set; }
        public string Competitor2Difficulties { get; set; }
        public string Competitor2UsefulFeatures { get; set; }

        public string BenchmarkFindings { get; set; }
        public string BenchmarkImprovements { get; set; }

        public bool? BenchmarkUsedSmartphoneForScreens { get; set; }
        public bool? BenchmarkUsedSmartphoneForComparative { get; set; }
        public bool? BenchmarkConsideredMobileFirst { get; set; }

        // Ejercicio reflexivo Fase 2
        public string ReflectionPhase2 { get; set; }

        // ========== Fase 3: Investigación de la audiencia ==========
        public string AudienceQuestions { get; set; } // En JSON o como string
        public string ReflectionPhase3 { get; set; }

        // ========== Otros campos adicionales ==========
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
