using EduMobile.Server.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

public class ApplicationUser : IdentityUser
{
    [Required]
    [MaxLength(10)]
    public string Matricula { get; set; }

    [Required]
    [MaxLength(50)]
    public string Nombre { get; set; }

    [Required]
    [MaxLength(50)]
    public string ApellidoPaterno { get; set; }

    [Required]
    [MaxLength(50)]
    public string ApellidoMaterno { get; set; }

    [Required]
    [MaxLength(20)]
    public string Role { get; set; }

    // Relación con los semestres en los que está inscrito
    public ICollection<SemesterStudent> Semesters { get; set; } = new List<SemesterStudent>();

    // Relación con los proyectos que ha creado
    public ICollection<Project> Projects { get; set; } = new List<Project>();

    public ICollection<ProjectUser> ProjectUsers { get; set; } = new List<ProjectUser>();


}
