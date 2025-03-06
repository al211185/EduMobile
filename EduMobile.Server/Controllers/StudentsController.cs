using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Profesor")]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(ApplicationDbContext context, ILogger<StudentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // DELETE: api/Students/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (student == null)
                return NotFound(new { Message = "Estudiante no encontrado." });

            // Eliminar relaciones en tablas intermedias (SemesterStudents)
            var relatedSemesterStudents = _context.SemesterStudents.Where(ss => ss.StudentId == id);
            if (relatedSemesterStudents.Any())
            {
                _context.SemesterStudents.RemoveRange(relatedSemesterStudents);
            }

            _context.Users.Remove(student);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Estudiante {StudentId} eliminado", id);
            return Ok(new { Message = "Estudiante eliminado con éxito." });
        }
    }
}
