using System;
using System.ComponentModel.DataAnnotations;

namespace EduMobile.Server.Models
{
    public class DesignPhase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        // Fase 1: Mapa del Sitio
        public string? SiteMapFilePath { get; set; } // Ruta del archivo subido
        public bool? IsHierarchyClear { get; set; }
        public bool? AreSectionsIdentified { get; set; }
        public bool? AreLinksClear { get; set; }
        public bool? AreVisualElementsUseful { get; set; }

        // Fase 2: Wireframes
        public string? Wireframe480pxPath { get; set; }
        public string? Wireframe768pxPath { get; set; }
        public string? Wireframe1024pxPath { get; set; }
        public bool? IsMobileFirst { get; set; }
        public bool? IsNavigationClear { get; set; }
        public bool? IsDesignFunctional { get; set; }
        public bool? IsVisualConsistencyMet { get; set; }

        // Fase 3: Diseño Visual
        public string? VisualDesignFilePath { get; set; }
        public bool? AreVisualElementsBeneficialForSmallScreens { get; set; }
        public bool? DoesDesignPrioritizeContentForMobile { get; set; }
        public bool? DoesDesignImproveLoadingSpeed { get; set; }

        // Fase 4: Creación de Contenidos
        public string? ContentFilePath { get; set; }
        public bool? AreContentsRelevantForMobile { get; set; }
        public bool? AreContentsClearAndNavigable { get; set; }
        public bool? DoContentsGuideUserAttention { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
