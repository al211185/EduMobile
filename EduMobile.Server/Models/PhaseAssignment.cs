using System;

namespace EduMobile.Server.Models
{
    // Opcional: Enum para representar las fases del proyecto
    public enum ProjectPhase
    {
        Planeacion = 1,
        Diseno = 2,
        Desarrollo = 3,
        Evaluacion = 4
    }

    public class PhaseAssignment
    {
        public int Id { get; set; }

        // Clave foránea al proyecto
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        // Clave foránea al usuario (alumno)
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        // Asigna la fase; se puede utilizar un enum para mayor claridad
        public ProjectPhase AssignedPhase { get; set; }
    }
}
