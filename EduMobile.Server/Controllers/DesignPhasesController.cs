using Azure.Core;
using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignPhasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public DesignPhasesController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/DesignPhases/{projectId}
        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetDesignPhaseByProjectId(int projectId)
        {
            try
            {
                var designPhase = await _context.DesignPhases
                    .FirstOrDefaultAsync(dp => dp.ProjectId == projectId);

                if (designPhase == null)
                {
                    return NotFound(new { Message = "No se encontró una fase de diseño para este proyecto." });
                }

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener la fase de diseño: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // POST: api/DesignPhases
        [HttpPost]
        public async Task<IActionResult> CreateDesignPhase([FromBody] CreateDesignPhaseRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Message = "Datos inválidos." });
                }

                var project = await _context.Projects.FindAsync(request.ProjectId);
                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado." });
                }

                var designPhase = new DesignPhase
                {
                    ProjectId = request.ProjectId,
                    SiteMapFilePath = request.SiteMapFilePath,
                    IsHierarchyClear = request.IsHierarchyClear,
                    AreSectionsIdentified = request.AreSectionsIdentified,
                    AreLinksClear = request.AreLinksClear,
                    AreVisualElementsUseful = request.AreVisualElementsUseful,

                    //fase 2
                    Wireframe480pxPath = request.Wireframe480pxPath,
                    Wireframe768pxPath = request.Wireframe768pxPath,
                    Wireframe1024pxPath = request.Wireframe1024pxPath,
                    IsMobileFirst = request.IsMobileFirst,
                    IsNavigationClear = request.IsNavigationClear,
                    IsDesignFunctional = request.IsDesignFunctional,
                    IsVisualConsistencyMet = request.IsVisualConsistencyMet,

                    UpdatedAt = DateTime.UtcNow
                };

                _context.DesignPhases.Add(designPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase de diseño creada exitosamente.", PhaseId = designPhase.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear la fase de diseño: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/DesignPhases/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDesignPhase(int id, [FromBody] UpdateDesignPhaseRequest request)
        {
            try
            {
                var designPhase = await _context.DesignPhases.FindAsync(id);
                if (designPhase == null)
                {
                    return NotFound(new { Message = "Fase de diseño no encontrada." });
                }

                // Verificar si se está actualizando la imagen
                if (!string.IsNullOrEmpty(request.SiteMapFilePath) && request.SiteMapFilePath != designPhase.SiteMapFilePath)
                {
                    // Ruta completa de la imagen anterior
                    string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    string oldFilePath = Path.Combine(uploadPath, Path.GetFileName(designPhase.SiteMapFilePath));

                    // Eliminar la imagen anterior si existe
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }

                    // Actualizar el campo de la nueva imagen
                    designPhase.SiteMapFilePath = request.SiteMapFilePath;
                }

                designPhase.IsHierarchyClear = request.IsHierarchyClear ?? designPhase.IsHierarchyClear;
                designPhase.AreSectionsIdentified = request.AreSectionsIdentified ?? designPhase.AreSectionsIdentified;
                designPhase.AreLinksClear = request.AreLinksClear ?? designPhase.AreLinksClear;
                designPhase.AreVisualElementsUseful = request.AreVisualElementsUseful ?? designPhase.AreVisualElementsUseful;

                _context.DesignPhases.Update(designPhase);
                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar la fase de diseño: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/DesignPhases/Phase2/{id}
        [HttpPut("Phase2/{id}")]
        public async Task<IActionResult> UpdateDesignPhasePhase2(int id, [FromBody] UpdateDesignPhase2Request request)
        {
            try
            {
                var designPhase = await _context.DesignPhases.FindAsync(id);
                if (designPhase == null)
                {
                    return NotFound(new { Message = "Fase de diseño no encontrada." });
                }

                // Wireframe480pxPath
                if (!string.IsNullOrEmpty(request.Wireframe480pxPath) && request.Wireframe480pxPath != designPhase.Wireframe480pxPath)
                {
                    string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    if (!string.IsNullOrEmpty(designPhase.Wireframe480pxPath))
                    {
                        string oldFilePath = Path.Combine(uploadPath, Path.GetFileName(designPhase.Wireframe480pxPath));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    designPhase.Wireframe480pxPath = request.Wireframe480pxPath;
                }


                // Wireframe768pxPath
                if (!string.IsNullOrEmpty(request.Wireframe768pxPath) && request.Wireframe768pxPath != designPhase.Wireframe768pxPath)
                {
                    string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    if (!string.IsNullOrEmpty(designPhase.Wireframe768pxPath))
                    {
                        string oldFilePath = Path.Combine(uploadPath, Path.GetFileName(designPhase.Wireframe768pxPath));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    designPhase.Wireframe768pxPath = request.Wireframe768pxPath;
                }


                // Wireframe1024pxPath
                if (!string.IsNullOrEmpty(request.Wireframe1024pxPath) && request.Wireframe1024pxPath != designPhase.Wireframe1024pxPath)
                {
                    string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    if (!string.IsNullOrEmpty(designPhase.Wireframe1024pxPath))
                    {
                        string oldFilePath = Path.Combine(uploadPath, Path.GetFileName(designPhase.Wireframe1024pxPath));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    designPhase.Wireframe1024pxPath = request.Wireframe1024pxPath;
                }


                //2

                designPhase.IsMobileFirst = request.IsMobileFirst ?? designPhase.IsMobileFirst;
                designPhase.IsNavigationClear = request.IsNavigationClear ?? designPhase.IsNavigationClear;
                designPhase.IsDesignFunctional = request.IsDesignFunctional ?? designPhase.IsDesignFunctional;
                designPhase.IsVisualConsistencyMet = request.IsVisualConsistencyMet ?? designPhase.IsVisualConsistencyMet;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);
                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar la fase de diseño: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        [HttpPut("Phase3/{id}")]
        public async Task<IActionResult> UpdateDesignPhaseVisual(int id, [FromBody] UpdateVisualDesignRequest request)
        {
            try
            {
                var designPhase = await _context.DesignPhases.FindAsync(id);
                if (designPhase == null)
                {
                    return NotFound(new { Message = "Fase de diseño no encontrada." });
                }

                designPhase.VisualDesignFilePath = request.VisualDesignFilePath;
                designPhase.AreVisualElementsBeneficialForSmallScreens = request.AreVisualElementsBeneficialForSmallScreens;
                designPhase.DoesDesignPrioritizeContentForMobile = request.DoesDesignPrioritizeContentForMobile;
                designPhase.DoesDesignImproveLoadingSpeed = request.DoesDesignImproveLoadingSpeed;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);
                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar la fase de diseño visual: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        [HttpPut("Phase4/{id}")]
        public async Task<IActionResult> UpdateContentCreationPhase(int id, [FromBody] UpdateContentCreationRequest request)
        {
            try
            {
                var designPhase = await _context.DesignPhases.FindAsync(id);
                if (designPhase == null)
                {
                    return NotFound(new { Message = "Fase de diseño no encontrada." });
                }

                // Actualizar los campos correspondientes a la fase 4
                designPhase.ContentFilePath = request.ContentFilePath;
                designPhase.AreContentsRelevantForMobile = request.AreContentsRelevantForMobile;
                designPhase.AreContentsClearAndNavigable = request.AreContentsClearAndNavigable;
                designPhase.DoContentsGuideUserAttention = request.DoContentsGuideUserAttention;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);
                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar la fase de creación de contenidos: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        // DELETE: api/DesignPhases/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDesignPhase(int id)
        {
            try
            {
                var designPhase = await _context.DesignPhases.FindAsync(id);
                if (designPhase == null)
                {
                    return NotFound(new { Message = "Fase de diseño no encontrada." });
                }

                _context.DesignPhases.Remove(designPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase de diseño eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al eliminar la fase de diseño: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // POST: api/DesignPhases/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
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

                // Límite de tamaño del archivo
                long maxFileSize = 5 * 1024 * 1024; // 5 MB
                if (file.Length > maxFileSize)
                {
                    return BadRequest(new { Message = "El archivo excede el tamaño máximo permitido de 5 MB." });
                }

                // Generar un nombre único para el archivo
                string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName)
                    .Replace(" ", "_")
                    .Replace("-", "_")
                    .Replace(".", "_");
                string uniqueFileName = $"{sanitizedFileName}_{DateTime.Now:yyyyMMddHHmmssfff}{fileExtension}";

                // Ruta de almacenamiento en la carpeta /wwwroot/uploads/
                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Guardar el archivo
                string filePath = Path.Combine(uploadPath, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar la ruta relativa que coincida con la esperada por el método GetImage
                string relativePath = $"/uploads/{uniqueFileName}";
                return Ok(new
                {
                    Message = "Archivo subido con éxito.",
                    FilePath = relativePath,
                    FileName = uniqueFileName,
                    OriginalFileName = file.FileName,
                    Size = file.Length
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al subir el archivo: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // GET: api/DesignPhases/image/{fileName}
        [HttpGet("image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            try
            {
                // Ruta del archivo en el servidor
                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                string filePath = Path.Combine(uploadPath, fileName); // Asegúrate de que solo pase el nombre del archivo

                // Validar si el archivo existe
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new { Message = "El archivo no existe." });
                }

                // Obtener el contenido del archivo
                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();

                // Determinar el tipo MIME del archivo
                string mimeType = fileExtension switch
                {
                    ".jpg" => "image/jpeg",
                    ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".pdf" => "application/pdf",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    _ => "application/octet-stream",
                };

                // Retornar el archivo con el tipo MIME adecuado
                return File(fileBytes, mimeType, fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener el archivo: {ex.Message}");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }



    }

    // Modelo para crear una fase de diseño
    public class CreateDesignPhaseRequest
    {
        public int ProjectId { get; set; }
        public string SiteMapFilePath { get; set; }
        public bool IsHierarchyClear { get; set; }
        public bool AreSectionsIdentified {  get; set; }
        public bool AreLinksClear {  get; set; }
        public bool AreVisualElementsUseful {  get; set; }

        //fase 2
        public string Wireframe480pxPath { get; set; }
        public string Wireframe768pxPath { get; set; }
        public string Wireframe1024pxPath { get; set; }
        public bool IsMobileFirst { get; set; }
        public bool IsNavigationClear { get; set; }
        public bool IsDesignFunctional { get; set; }
        public bool IsVisualConsistencyMet { get; set; }

    }

    // Modelo para actualizar una fase de diseño
    public class UpdateDesignPhaseRequest
    {
        public string SiteMapFilePath { get; set; }
        public bool? IsHierarchyClear { get; set; }
        public bool? AreSectionsIdentified { get; set; }
        public bool? AreLinksClear { get; set; }
        public bool? AreVisualElementsUseful { get; set; }
    }

    public class UpdateDesignPhase2Request
    {
        public string Wireframe480pxPath { get; set; }
        public string Wireframe768pxPath { get; set; }
        public string Wireframe1024pxPath { get; set; }
        public bool? IsMobileFirst { get; set; }
        public bool? IsNavigationClear { get; set; }
        public bool? IsDesignFunctional { get; set; }
        public bool? IsVisualConsistencyMet { get; set; }
    }

    public class UpdateVisualDesignRequest
    {
        public string VisualDesignFilePath { get; set; }
        public bool AreVisualElementsBeneficialForSmallScreens { get; set; }
        public bool DoesDesignPrioritizeContentForMobile { get; set; }
        public bool DoesDesignImproveLoadingSpeed { get; set; }
    }

    public class UpdateContentCreationRequest
    {
        public string ContentFilePath { get; set; }
        public bool AreContentsRelevantForMobile { get; set; }
        public bool AreContentsClearAndNavigable { get; set; }
        public bool DoContentsGuideUserAttention { get; set; }
    }

}
