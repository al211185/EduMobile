using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Profesor")]
    public class SemestersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SemestersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Semesters/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateSemester([FromBody] CreateSemesterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest("Datos inválidos.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var semester = new Semester
            {
                Name = request.Name,
                Year = request.Year,
                Period = request.Period,
                Description = request.Description,
                ProfessorId = userId,
                Course = request.Course // Agrega el curso
            };

            _context.Semesters.Add(semester);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Semestre creado con éxito." });
        }

        // GET: api/Semesters
        [HttpGet]
        public IActionResult GetSemesters()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var semesters = _context.Semesters
                .Where(s => s.ProfessorId == userId)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Year,
                    s.Period,
                    s.Description,
                    s.Course // Incluye el curso en la respuesta
                })
                .ToList();

            return Ok(semesters);
        }

        // GET: api/Semesters/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSemester(int id)
        {
            var semester = await _context.Semesters.FindAsync(id);

            if (semester == null)
                return NotFound("Semestre no encontrado.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (semester.ProfessorId != userId)
                return Forbid();

            return Ok(new
            {
                semester.Id,
                semester.Name,
                semester.Year,
                semester.Period,
                semester.Description,
                semester.Course // Incluye el curso en la respuesta
            });
        }

        // POST: api/Semesters/{id}/assign-student
        [HttpPost("{id}/assign-student")]
        public async Task<IActionResult> AssignStudentToSemester(int id, [FromBody] AssignStudentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos no válidos." });

            var semester = await _context.Semesters.FindAsync(id);
            if (semester == null)
                return NotFound(new { Message = "Semestre no encontrado." });

            var student = await _context.Users.FindAsync(request.StudentId);
            if (student == null)
                return NotFound(new { Message = "Estudiante no encontrado." });

            var existingRelation = await _context.SemesterStudents
                .FirstOrDefaultAsync(ss => ss.SemesterId == id && ss.StudentId == request.StudentId);

            if (existingRelation != null)
                return BadRequest(new { Message = "El estudiante ya está asignado a este semestre." });

            var semesterStudent = new SemesterStudent
            {
                SemesterId = id,
                StudentId = request.StudentId
            };

            _context.SemesterStudents.Add(semesterStudent);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Estudiante asignado al semestre exitosamente." });
        }


        // GET: api/Semesters/{id}/students
        [HttpGet("{id}/students")]
        public async Task<IActionResult> GetStudentsBySemester(int id)
        {
            var semester = await _context.Semesters
                .Include(s => s.SemesterStudents)
                .ThenInclude(ss => ss.Student)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (semester == null)
            {
                return NotFound(new { Message = "Semestre no encontrado." });
            }

            var students = semester.SemesterStudents.Select(ss => new
            {
                ss.Student.Id,
                ss.Student.Nombre,
                ss.Student.ApellidoPaterno,
                ss.Student.ApellidoMaterno,
                ss.Student.Email
            }).ToList();

            return Ok(students);
        }

    }

    public class CreateSemesterRequest
    {
        public string Name { get; set; }
        public int Year { get; set; }
        public string Period { get; set; }
        public string Description { get; set; }
        public string Course { get; set; } // Nuevo campo para el curso
    }

    public class AssignStudentRequest
    {
        public string StudentId { get; set; } // ID del estudiante
    }
}
