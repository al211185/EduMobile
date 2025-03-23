using EduMobile.Server.Areas.Identity.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, ILogger<AuthController> logger)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Datos de inicio de sesión no válidos." });
            }

            var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, request.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user != null)
                {
                    _logger.LogInformation($"Usuario {user.Nombre} inició sesión correctamente.");
                    return Ok(new
                    {
                        Message = "Inicio de sesión exitoso.",
                        User = new
                        {
                            user.Id, // Agrega el ID del usuario
                            user.Nombre,
                            user.ApellidoPaterno,
                            user.ApellidoMaterno,
                            user.Email,
                            user.Matricula,
                            user.Role
                        }
                    });
                }

                return Unauthorized(new { Message = "Usuario no encontrado después de iniciar sesión." });
            }

            if (result.RequiresTwoFactor)
            {
                return Unauthorized(new { Message = "Se requiere autenticación de dos factores." });
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning("Cuenta de usuario bloqueada.");
                return Unauthorized(new { Message = "La cuenta está bloqueada." });
            }

            return Unauthorized(new { Message = "Intento de inicio de sesión no válido." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos no válidos." });

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                Nombre = request.Nombre,
                ApellidoPaterno = request.ApellidoPaterno,
                ApellidoMaterno = request.ApellidoMaterno,
                Matricula = request.Matricula,
                Role = "Alumno" // Asigna un rol predeterminado
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Alumno"); // Añadir al rol predeterminado en Identity
                return Ok(new { Message = "Registro exitoso." });
            }
            else
            {
                return BadRequest(new { Message = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Datos no válidos." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }

            var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }

            await _signInManager.RefreshSignInAsync(user);
            _logger.LogInformation($"Usuario {user.UserName} cambió su contraseña correctamente.");
            return Ok(new { Message = "Contraseña actualizada correctamente." });
        }

        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos no válidos." });

            var email = $"al{request.Matricula}@alumnos.uacj.mx";
            var password = $"Al{request.Matricula}!";

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                Nombre = request.Nombre,
                ApellidoPaterno = request.ApellidoPaterno,
                ApellidoMaterno = request.ApellidoMaterno,
                Matricula = request.Matricula,
                Role = "Alumno"
            };

            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return BadRequest(new { Message = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }

            await _userManager.AddToRoleAsync(user, "Alumno");

            // Devuelve el ID del estudiante recién creado
            return Ok(new
            {
                StudentId = user.Id // Incluye el ID del estudiante en la respuesta
            });
        }

        [HttpPost("register-students")]
        public async Task<IActionResult> RegisterStudents([FromBody] List<RegisterStudentRequest> requests)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Datos no válidos." });

            var results = new List<object>();

            foreach (var request in requests)
            {
                var email = $"al{request.Matricula}@alumnos.uacj.mx";
                var password = $"Al{request.Matricula}!";

                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    Nombre = request.Nombre,
                    ApellidoPaterno = request.ApellidoPaterno,
                    ApellidoMaterno = request.ApellidoMaterno,
                    Matricula = request.Matricula,
                    Role = "Alumno"
                };

                var result = await _userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Alumno");
                    results.Add(new { Matricula = request.Matricula, Success = true, UserId = user.Id });
                }
                else
                {
                    results.Add(new { Matricula = request.Matricula, Success = false, Errors = result.Errors.Select(e => e.Description) });
                }
            }

            return Ok(new { Message = "Registro masivo completado.", Results = results });
        }



    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class RegisterRequest
    {
        [Required] public string Email { get; set; }
        [Required] public string Password { get; set; }
        [Required] public string Nombre { get; set; }
        [Required] public string ApellidoPaterno { get; set; }
        [Required] public string ApellidoMaterno { get; set; }
        [Required] public string Matricula { get; set; }
    }

    public class ChangePasswordRequest
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Las contraseñas no coinciden.")]
        public string ConfirmPassword { get; set; }
    }

    public class RegisterStudentRequest
    {
        [Required]
        public string Matricula { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string ApellidoPaterno { get; set; }

        [Required]
        public string ApellidoMaterno { get; set; }
    }
}