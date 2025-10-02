using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly string _uploadPath;
        private readonly ILogger<FilesController> _logger;

        public FilesController(IWebHostEnvironment environment, ILogger<FilesController> logger)
        {
            _uploadPath = Path.Combine(environment.WebRootPath, "uploads");
            _logger = logger;
        }

        // Método para eliminar un archivo si existe
        private void DeleteFileIfExists(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                // Extraer solo el nombre del archivo (suponiendo que se guarda como "/uploads/filename.ext")
                string fileName = Path.GetFileName(filePath);
                string fullPath = Path.Combine(_uploadPath, fileName);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
        }

        // POST: api/Files/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string oldFilePath = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "El archivo no es válido." });
            }

            try
            {
                // Validación del tipo de archivo
                var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".docx" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(fileExtension) || !permittedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { Message = "Tipo de archivo no permitido." });
                }

                // Límite de tamaño del archivo: 5 MB
                long maxFileSize = 5 * 1024 * 1024;
                if (file.Length > maxFileSize)
                {
                    return BadRequest(new { Message = "El archivo excede el tamaño máximo permitido de 5 MB." });
                }

                // Si se pasa la ruta de un archivo anterior, se elimina (para evitar acumular archivos innecesarios)
                if (!string.IsNullOrEmpty(oldFilePath))
                {
                    DeleteFileIfExists(oldFilePath);
                }

                // Generar un nombre único completamente serializado usando un GUID
                string uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

                if (!Directory.Exists(_uploadPath))
                {
                    Directory.CreateDirectory(_uploadPath);
                }

                string filePath = Path.Combine(_uploadPath, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar la ruta relativa para que coincida con el endpoint GetImage
                string relativePath = $"/uploads/{uniqueFileName}";
                return Ok(new
                {
                    Message = "Archivo subido con éxito.",
                    FilePath = relativePath,
                    FileName = uniqueFileName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir el archivo.");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        // GET: api/Files/image/{*filePath}
        [HttpGet("image/{*filePath}")]
        public IActionResult GetImage(string filePath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(filePath))
                {
                    return BadRequest(new { Message = "La ruta del archivo es inválida." });
                }

                var rawSegments = filePath.Split(new[] { '/', '\\' }, StringSplitOptions.RemoveEmptyEntries);


                var safeSegments = new List<string>();

                foreach (var segment in rawSegments)
                {
                    if (string.IsNullOrWhiteSpace(segment))
                    {
                        continue;
                    }

                    var trimmed = segment.Trim();
                    if (trimmed == "." || trimmed == "..")
                    {
                        continue;
                    }

                    safeSegments.Add(Path.GetFileName(trimmed));
                }

                if (safeSegments.Count == 0)
                {
                    return NotFound(new { Message = "El archivo no existe." });
                }

                if (safeSegments[0].Equals("uploads", StringComparison.OrdinalIgnoreCase))
                {
                    safeSegments.RemoveAt(0);
                }

                if (safeSegments.Count == 0)
                {
                    return NotFound(new { Message = "El archivo no existe." });
                }

                var relativePath = Path.Combine(safeSegments.ToArray());
                var combinedPath = Path.Combine(_uploadPath, relativePath);
                var uploadsRoot = Path.GetFullPath(_uploadPath);
                var fullPath = Path.GetFullPath(combinedPath);

                if (!fullPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { Message = "La ruta del archivo es inválida." });
                }

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound(new { Message = "El archivo no existe." });
                }

                var fileBytes = System.IO.File.ReadAllBytes(fullPath);
                var fileExtension = Path.GetExtension(fullPath).ToLowerInvariant();

                string mimeType = fileExtension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".pdf" => "application/pdf",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    _ => "application/octet-stream",
                };

                return File(fileBytes, mimeType, Path.GetFileName(fullPath));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el archivo {FilePath}", filePath);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }
    }
}
