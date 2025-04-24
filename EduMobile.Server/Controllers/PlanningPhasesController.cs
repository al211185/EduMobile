using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanningPhasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PlanningPhasesController> _logger;
        private readonly IWebHostEnvironment _environment;

        public PlanningPhasesController(ApplicationDbContext context, IWebHostEnvironment environment, ILogger<PlanningPhasesController> logger)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        /// <summary>
        /// Marca el proyecto como modificado justo ahora.
        /// </summary>
        private async Task PropagateProjectTimestamp(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project != null)
            {
                project.UpdatedAt = DateTime.UtcNow;
                _context.Projects.Update(project);
            }
        }

        // ==========================
        //   GET (por projectId)
        // ==========================
        // GET: api/PlanningPhases/{projectId}
        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetPlanningPhaseByProjectId(int projectId)
        {
            try
            {
                var planningPhase = await _context.PlanningPhases
                    .FirstOrDefaultAsync(pp => pp.ProjectId == projectId);

                if (planningPhase == null)
                {
                    return NotFound(new { Message = "No se encontró la fase de planeación para este proyecto." });
                }

                return Ok(planningPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la fase de planeación para el proyecto {ProjectId}", projectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // ==========================
        //   POST (creación)
        // ==========================
        // POST: api/PlanningPhases
        [HttpPost]
        public async Task<IActionResult> CreatePlanningPhase([FromBody] CreatePlanningPhaseRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { Message = "Datos inválidos." });

                // Verificar que el proyecto exista (opcional si ProjectId es foráneo)
                var project = await _context.Projects.FindAsync(request.ProjectId);
                if (project == null)
                {
                    return NotFound(new { Message = "Proyecto no encontrado." });
                }

                var planningPhase = new PlanningPhase
                {
                    ProjectId = request.ProjectId,

                    // FASE 1
                    ProjectName = request.ProjectName,
                    ClienteName = request.ClienteName,
                    Responsable = request.Responsable,
                    StartDate = request.StartDate,
                    GeneralObjective = request.GeneralObjective,
                    SpecificObjectives = request.SpecificObjectives,
                    FunctionalRequirements = request.FunctionalRequirements,
                    CustomRequirements = request.CustomRequirements,
                    CorporateColors = request.CorporateColors,
                    CorporateFont = request.CorporateFont,
                    AllowedTechnologies = request.AllowedTechnologies,
                    CustomTechnologies = request.CustomTechnologies,
                    ReflectionPhase1 = request.ReflectionPhase1,

                    // FASE 2
                    BenchmarkObjective = request.BenchmarkObjective,
                    BenchmarkSector = request.BenchmarkSector,
                    BenchmarkResponsableF2 = request.BenchmarkResponsableF2,
                    Competitor1Name = request.Competitor1Name,
                    Competitor1ScreenshotPath = request.Competitor1ScreenshotPath,
                    Competitor1Url = request.Competitor1Url,
                    Competitor1Positives = request.Competitor1Positives,
                    Competitor1Negatives = request.Competitor1Negatives,
                    Competitor1EaseOfUse = request.Competitor1EaseOfUse,
                    Competitor1Difficulties = request.Competitor1Difficulties,
                    Competitor1UsefulFeatures = request.Competitor1UsefulFeatures,
                    Competitor2Name = request.Competitor2Name,
                    Competitor2ScreenshotPath = request.Competitor2ScreenshotPath,
                    Competitor2Url = request.Competitor2Url,
                    Competitor2Positives = request.Competitor2Positives,
                    Competitor2Negatives = request.Competitor2Negatives,
                    Competitor2EaseOfUse = request.Competitor2EaseOfUse,
                    Competitor2Difficulties = request.Competitor2Difficulties,
                    Competitor2UsefulFeatures = request.Competitor2UsefulFeatures,
                    BenchmarkFindings = request.BenchmarkFindings,
                    BenchmarkImprovements = request.BenchmarkImprovements,
                    BenchmarkUsedSmartphoneForScreens = request.BenchmarkUsedSmartphoneForScreens,
                    BenchmarkUsedSmartphoneForComparative = request.BenchmarkUsedSmartphoneForComparative,
                    BenchmarkConsideredMobileFirst = request.BenchmarkConsideredMobileFirst,
                    ReflectionPhase2 = request.ReflectionPhase2,

                    // FASE 3
                    AudienceQuestions = request.AudienceQuestions,
                    ReflectionPhase3 = request.ReflectionPhase3,

                    // UpdatedAt
                    UpdatedAt = DateTime.UtcNow
                };

                _context.PlanningPhases.Add(planningPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase de planeación creada exitosamente.", PlanningPhaseId = planningPhase.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la fase de planeación para el proyecto {ProjectId}", request.ProjectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // ========================================
        //   PUT Fase1: api/PlanningPhases/Phase1/{id}
        // ========================================
        [HttpPut("Phase1/{id}")]
        public async Task<IActionResult> UpdatePlanningPhasePhase1(int id, [FromBody] UpdatePlanningPhaseF1Request request)
        {
            try
            {
                var planningPhase = await _context.PlanningPhases.FindAsync(id);
                if (planningPhase == null)
                {
                    return NotFound(new { Message = "Fase de planeación no encontrada." });
                }

                // Actualización de campos de Fase 1
                if (!string.IsNullOrWhiteSpace(request.ProjectName))
                    planningPhase.ProjectName = request.ProjectName;

                if (!string.IsNullOrWhiteSpace(request.ClienteName))
                    planningPhase.ClienteName = request.ClienteName;

                if (!string.IsNullOrWhiteSpace(request.Responsable))
                    planningPhase.Responsable = request.Responsable;

                if (request.StartDate != default)
                    planningPhase.StartDate = request.StartDate;

                if (!string.IsNullOrWhiteSpace(request.GeneralObjective))
                    planningPhase.GeneralObjective = request.GeneralObjective;

                if (!string.IsNullOrWhiteSpace(request.SpecificObjectives))
                    planningPhase.SpecificObjectives = request.SpecificObjectives;

                if (!string.IsNullOrWhiteSpace(request.FunctionalRequirements))
                    planningPhase.FunctionalRequirements = request.FunctionalRequirements;

                if (!string.IsNullOrWhiteSpace(request.CustomRequirements))
                    planningPhase.CustomRequirements = request.CustomRequirements;

                if (!string.IsNullOrWhiteSpace(request.CorporateColors))
                    planningPhase.CorporateColors = request.CorporateColors;

                if (!string.IsNullOrWhiteSpace(request.CorporateFont))
                    planningPhase.CorporateFont = request.CorporateFont;

                if (!string.IsNullOrWhiteSpace(request.AllowedTechnologies))
                    planningPhase.AllowedTechnologies = request.AllowedTechnologies;

                if (!string.IsNullOrWhiteSpace(request.CustomTechnologies))
                    planningPhase.CustomTechnologies = request.CustomTechnologies;

                if (!string.IsNullOrWhiteSpace(request.ReflectionPhase1))
                    planningPhase.ReflectionPhase1 = request.ReflectionPhase1;

                planningPhase.UpdatedAt = DateTime.UtcNow;
                _context.PlanningPhases.Update(planningPhase);

                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(planningPhase.ProjectId);

                await _context.SaveChangesAsync();

                // Sincronizar automáticamente el backlog del DevelopmentPhase (Kanban board)
                var developmentPhase = await _context.DevelopmentPhases
                    .FirstOrDefaultAsync(dp => dp.ProjectId == planningPhase.ProjectId);

                if (developmentPhase != null)
                {
                    // Eliminar tarjetas existentes para evitar duplicados
                    var existingItems = _context.KanbanItems.Where(ki => ki.DevelopmentPhaseId == developmentPhase.Id);
                    _context.KanbanItems.RemoveRange(existingItems);

                    // Recopilar ítems del backlog a partir de los campos actualizados
                    var backlogItems = new List<string>();

                    if (!string.IsNullOrWhiteSpace(planningPhase.AllowedTechnologies))
                    {
                        backlogItems.AddRange(
                            planningPhase.AllowedTechnologies.Split(",")
                            .Select(x => x.Trim())
                            .Where(x => !string.IsNullOrEmpty(x))
                        );
                    }
                    if (!string.IsNullOrWhiteSpace(planningPhase.CustomTechnologies))
                    {
                        backlogItems.AddRange(
                            planningPhase.CustomTechnologies.Split(",")
                            .Select(x => x.Trim())
                            .Where(x => !string.IsNullOrEmpty(x))
                        );
                    }
                    if (!string.IsNullOrWhiteSpace(planningPhase.FunctionalRequirements))
                    {
                        backlogItems.AddRange(
                            planningPhase.FunctionalRequirements.Split(";")
                            .Select(x => x.Trim())
                            .Where(x => !string.IsNullOrEmpty(x))
                        );
                    }
                    if (!string.IsNullOrWhiteSpace(planningPhase.CustomRequirements))
                    {
                        backlogItems.AddRange(
                            planningPhase.CustomRequirements.Split(";")
                            .Select(x => x.Trim())
                            .Where(x => !string.IsNullOrEmpty(x))
                        );
                    }

                    // Crear una nueva tarjeta (KanbanItem) por cada ítem del backlog
                    foreach (var item in backlogItems)
                    {
                        var kanbanItem = new KanbanItem
                        {
                            Title = item,
                            Description = "",
                            Status = "Backlog",
                            Order = 0, // Puedes implementar lógica para ordenar si es necesario
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            DevelopmentPhaseId = developmentPhase.Id
                        };
                        _context.KanbanItems.Add(kanbanItem);
                    }

                    // Actualizar los campos del DevelopmentPhase con los nuevos valores
                    developmentPhase.AllowedTechnologies = planningPhase.AllowedTechnologies;
                    developmentPhase.CustomTechnologies = planningPhase.CustomTechnologies;
                    developmentPhase.FunctionalRequirements = planningPhase.FunctionalRequirements;
                    developmentPhase.CustomRequirements = planningPhase.CustomRequirements;
                    developmentPhase.UpdatedAt = DateTime.UtcNow;

                    // Marca el proyecto como actualizado:
                    await PropagateProjectTimestamp(planningPhase.ProjectId);

                    await _context.SaveChangesAsync();
                }

                return Ok(planningPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase 1 con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // ========================================
        //   PUT Fase2: api/PlanningPhases/Phase2/{id}
        // ========================================
        [HttpPut("Phase2/{id}")]
        public async Task<IActionResult> UpdatePlanningPhasePhase2(int id, [FromBody] UpdatePlanningPhaseF2Request request)
        {
            try
            {
                var planningPhase = await _context.PlanningPhases.FindAsync(id);
                if (planningPhase == null)
                {
                    return NotFound(new { Message = "Fase de planeación no encontrada." });
                }

                // Campos Fase 2
                if (!string.IsNullOrWhiteSpace(request.BenchmarkObjective))
                    planningPhase.BenchmarkObjective = request.BenchmarkObjective;

                if (!string.IsNullOrWhiteSpace(request.BenchmarkSector))
                    planningPhase.BenchmarkSector = request.BenchmarkSector;

                if (!string.IsNullOrWhiteSpace(request.BenchmarkResponsableF2))
                    planningPhase.BenchmarkResponsableF2 = request.BenchmarkResponsableF2;

                // Competidor 1
                if (!string.IsNullOrWhiteSpace(request.Competitor1Name))
                    planningPhase.Competitor1Name = request.Competitor1Name;
                if (!string.IsNullOrWhiteSpace(request.Competitor1ScreenshotPath) &&
                    request.Competitor1ScreenshotPath != planningPhase.Competitor1ScreenshotPath)
                {
                    DeleteFileIfExists(planningPhase.Competitor1ScreenshotPath);
                    planningPhase.Competitor1ScreenshotPath = request.Competitor1ScreenshotPath;
                }
                if (!string.IsNullOrWhiteSpace(request.Competitor1Url))
                    planningPhase.Competitor1Url = request.Competitor1Url;
                if (!string.IsNullOrWhiteSpace(request.Competitor1Positives))
                    planningPhase.Competitor1Positives = request.Competitor1Positives;
                if (!string.IsNullOrWhiteSpace(request.Competitor1Negatives))
                    planningPhase.Competitor1Negatives = request.Competitor1Negatives;

                planningPhase.Competitor1EaseOfUse = request.Competitor1EaseOfUse;

                if (!string.IsNullOrWhiteSpace(request.Competitor1Difficulties))
                    planningPhase.Competitor1Difficulties = request.Competitor1Difficulties;

                if (!string.IsNullOrWhiteSpace(request.Competitor1UsefulFeatures))
                    planningPhase.Competitor1UsefulFeatures = request.Competitor1UsefulFeatures;

                // Competidor 2
                if (!string.IsNullOrWhiteSpace(request.Competitor2Name))
                    planningPhase.Competitor2Name = request.Competitor2Name;
                if (!string.IsNullOrWhiteSpace(request.Competitor2ScreenshotPath) &&
                    request.Competitor2ScreenshotPath != planningPhase.Competitor2ScreenshotPath)
                {
                    DeleteFileIfExists(planningPhase.Competitor2ScreenshotPath);
                    planningPhase.Competitor2ScreenshotPath = request.Competitor2ScreenshotPath;
                }
                if (!string.IsNullOrWhiteSpace(request.Competitor2Url))
                    planningPhase.Competitor2Url = request.Competitor2Url;
                if (!string.IsNullOrWhiteSpace(request.Competitor2Positives))
                    planningPhase.Competitor2Positives = request.Competitor2Positives;
                if (!string.IsNullOrWhiteSpace(request.Competitor2Negatives))
                    planningPhase.Competitor2Negatives = request.Competitor2Negatives;

                planningPhase.Competitor2EaseOfUse = request.Competitor2EaseOfUse;

                if (!string.IsNullOrWhiteSpace(request.Competitor2Difficulties))
                    planningPhase.Competitor2Difficulties = request.Competitor2Difficulties;

                if (!string.IsNullOrWhiteSpace(request.Competitor2UsefulFeatures))
                    planningPhase.Competitor2UsefulFeatures = request.Competitor2UsefulFeatures;

                // Benchmark
                if (!string.IsNullOrWhiteSpace(request.BenchmarkFindings))
                    planningPhase.BenchmarkFindings = request.BenchmarkFindings;

                if (!string.IsNullOrWhiteSpace(request.BenchmarkImprovements))
                    planningPhase.BenchmarkImprovements = request.BenchmarkImprovements;

                planningPhase.BenchmarkUsedSmartphoneForScreens = request.BenchmarkUsedSmartphoneForScreens;
                planningPhase.BenchmarkUsedSmartphoneForComparative = request.BenchmarkUsedSmartphoneForComparative;
                planningPhase.BenchmarkConsideredMobileFirst = request.BenchmarkConsideredMobileFirst;

                // Reflexivos
                if (!string.IsNullOrWhiteSpace(request.ReflectionPhase2))
                    planningPhase.ReflectionPhase2 = request.ReflectionPhase2;

                if (!string.IsNullOrWhiteSpace(request.AudienceQuestions))
                    planningPhase.AudienceQuestions = request.AudienceQuestions;

                if (!string.IsNullOrWhiteSpace(request.ReflectionPhase3))
                    planningPhase.ReflectionPhase3 = request.ReflectionPhase3;

                planningPhase.UpdatedAt = DateTime.UtcNow;
                _context.PlanningPhases.Update(planningPhase);

                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(planningPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(planningPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase 2 con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadCompetitorFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "El archivo no es válido." });
            }

            try
            {
                var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(fileExtension) || !permittedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { Message = "Tipo de archivo no permitido." });
                }

                long maxFileSize = 5 * 1024 * 1024; // 5 MB
                if (file.Length > maxFileSize)
                {
                    return BadRequest(new { Message = "El archivo excede el tamaño máximo de 5 MB." });
                }

                string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName)
                    .Replace(" ", "_")
                    .Replace("-", "_")
                    .Replace(".", "_");

                string uniqueFileName = $"{sanitizedFileName}_{DateTime.Now:yyyyMMddHHmmssfff}{fileExtension}";

                string uploadPath = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                string filePath = Path.Combine(uploadPath, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

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
                _logger.LogError(ex, "Error al subir archivo en PlanningPhasesController.");
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        // ========================================
        //   PUT Fase3: api/PlanningPhases/Phase3/{id}
        // ========================================
        [HttpPut("Phase3/{id}")]
        public async Task<IActionResult> UpdatePlanningPhasePhase3(int id, [FromBody] UpdatePlanningPhaseF3Request request)
        {
            try
            {
                var planningPhase = await _context.PlanningPhases.FindAsync(id);
                if (planningPhase == null)
                {
                    return NotFound(new { Message = "Fase de planeación no encontrada." });
                }

                // Actualiza el campo AudienceQuestions si se proporciona
                if (!string.IsNullOrWhiteSpace(request.AudienceQuestions))
                    planningPhase.AudienceQuestions = request.AudienceQuestions;

                // Actualiza el campo ReflectionPhase3 (Ejercicio reflexivo) si se proporciona
                if (!string.IsNullOrWhiteSpace(request.ReflectionPhase3))
                    planningPhase.ReflectionPhase3 = request.ReflectionPhase3;

                planningPhase.UpdatedAt = DateTime.UtcNow;
                _context.PlanningPhases.Update(planningPhase);
                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(planningPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(planningPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase 3 con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }


        // ==========================
        //   DELETE
        // ==========================
        // DELETE: api/PlanningPhases/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlanningPhase(int id)
        {
            try
            {
                var planningPhase = await _context.PlanningPhases.FindAsync(id);
                if (planningPhase == null)
                {
                    return NotFound(new { Message = "Fase de planeación no encontrada." });
                }

                _context.PlanningPhases.Remove(planningPhase);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Fase de planeación eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la fase de planeación con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        private void DeleteFileIfExists(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                // Se asume que los archivos se guardan en la carpeta "uploads" dentro de wwwroot
                string uploadPath = Path.Combine(_environment.WebRootPath, "uploads");
                string fullPath = Path.Combine(uploadPath, Path.GetFileName(filePath));
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
        }

    }

    // ========================
    //   MODELOS DE REQUEST
    // ========================

    // Este es tu modelo de creación, donde puedes incluir campos de todas las fases si gustas
    public class CreatePlanningPhaseRequest
    {
        public int ProjectId { get; set; }  // Requerido
        public string ProjectName { get; set; } // Fase 1
        public string ClienteName { get; set; }
        public string Responsable { get; set; }
        public DateTime StartDate { get; set; }
        public string GeneralObjective { get; set; }
        public string SpecificObjectives { get; set; }
        public string FunctionalRequirements { get; set; }
        public string CustomRequirements { get; set; }
        public string CorporateColors { get; set; }
        public string CorporateFont { get; set; }
        public string AllowedTechnologies { get; set; }
        public string CustomTechnologies { get; set; }
        public string ReflectionPhase1 { get; set; }

        // Fase 2
        public string BenchmarkObjective { get; set; }
        public string BenchmarkSector { get; set; }
        public string BenchmarkResponsableF2 { get; set; }
        public string Competitor1Name { get; set; }
        public string Competitor1ScreenshotPath { get; set; }
        public string Competitor1Url { get; set; }
        public string Competitor1Positives { get; set; }
        public string Competitor1Negatives { get; set; }
        public int Competitor1EaseOfUse { get; set; }
        public string Competitor1Difficulties { get; set; }
        public string Competitor1UsefulFeatures { get; set; }
        public string Competitor2Name { get; set; }
        public string Competitor2ScreenshotPath { get; set; }
        public string Competitor2Url { get; set; }
        public string Competitor2Positives { get; set; }
        public string Competitor2Negatives { get; set; }
        public int Competitor2EaseOfUse { get; set; }
        public string Competitor2Difficulties { get; set; }
        public string Competitor2UsefulFeatures { get; set; }
        public string BenchmarkFindings { get; set; }
        public string BenchmarkImprovements { get; set; }
        public bool BenchmarkUsedSmartphoneForScreens { get; set; }
        public bool BenchmarkUsedSmartphoneForComparative { get; set; }
        public bool BenchmarkConsideredMobileFirst { get; set; }
        public string ReflectionPhase2 { get; set; }

        // Fase 3
        public string AudienceQuestions { get; set; }
        public string ReflectionPhase3 { get; set; }
    }

    // Fase 1 - Update
    public class UpdatePlanningPhaseF1Request
    {
        public string ProjectName { get; set; }
        public string ClienteName { get; set; }
        public string Responsable { get; set; }
        public DateTime StartDate { get; set; }
        public string GeneralObjective { get; set; }
        public string SpecificObjectives { get; set; }
        public string FunctionalRequirements { get; set; }
        public string CustomRequirements { get; set; }
        public string CorporateColors { get; set; }
        public string CorporateFont { get; set; }
        public string AllowedTechnologies { get; set; }
        public string CustomTechnologies { get; set; }
        public string ReflectionPhase1 { get; set; }
    }

    // Fase 2 - Update
    public class UpdatePlanningPhaseF2Request
    {
        public string BenchmarkObjective { get; set; }
        public string BenchmarkSector { get; set; }
        public string BenchmarkResponsableF2 { get; set; }

        // Competidor 1
        public string Competitor1Name { get; set; }
        public string Competitor1ScreenshotPath { get; set; }
        public string Competitor1Url { get; set; }
        public string Competitor1Positives { get; set; }
        public string Competitor1Negatives { get; set; }
        public int Competitor1EaseOfUse { get; set; }
        public string Competitor1Difficulties { get; set; }
        public string Competitor1UsefulFeatures { get; set; }

        // Competidor 2
        public string Competitor2Name { get; set; }
        public string Competitor2ScreenshotPath { get; set; }
        public string Competitor2Url { get; set; }
        public string Competitor2Positives { get; set; }
        public string Competitor2Negatives { get; set; }
        public int Competitor2EaseOfUse { get; set; }
        public string Competitor2Difficulties { get; set; }
        public string Competitor2UsefulFeatures { get; set; }

        public string BenchmarkFindings { get; set; }
        public string BenchmarkImprovements { get; set; }

        public bool BenchmarkUsedSmartphoneForScreens { get; set; }
        public bool BenchmarkUsedSmartphoneForComparative { get; set; }
        public bool BenchmarkConsideredMobileFirst { get; set; }

        public string ReflectionPhase2 { get; set; }
        public string AudienceQuestions { get; set; }
        public string ReflectionPhase3 { get; set; }
    }

    // Fase 3 - Update
    public class UpdatePlanningPhaseF3Request
    {
        public string AudienceQuestions { get; set; }
        public string ReflectionPhase3 { get; set; }
    }
}
