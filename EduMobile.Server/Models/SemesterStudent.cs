using EduMobile.Server.Models;
using System.ComponentModel.DataAnnotations;

public class SemesterStudent
{
    public int SemesterId { get; set; } // Clave foránea al modelo Semester
    public Semester Semester { get; set; }

    [MaxLength(450)] // Ajustar a la longitud de IdentityUser.Id
    public string StudentId { get; set; } // Clave foránea al modelo ApplicationUser
    public ApplicationUser Student { get; set; }
}
