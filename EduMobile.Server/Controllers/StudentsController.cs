using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduMobile.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Profesor")]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            // Busca al estudiante por su ID
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (student == null)
            {
                return NotFound(new { Message = "Estudiante no encontrado." });
            }

            // Busca y elimina relaciones en tablas intermedias (si aplica)
            var relatedSemesterStudents = _context.SemesterStudents
                .Where(ss => ss.StudentId == id);
            if (relatedSemesterStudents.Any())
            {
                _context.SemesterStudents.RemoveRange(relatedSemesterStudents);
            }

            // Elimina al estudiante
            _context.Users.Remove(student);

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Estudiante eliminado con éxito." });
        }
    }
}
