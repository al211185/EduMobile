using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
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
        private readonly ILogger<DesignPhasesController> _logger;

        public DesignPhasesController(ApplicationDbContext context, IWebHostEnvironment environment, ILogger<DesignPhasesController> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
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

        #region Endpoints de Lectura y Creación

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
                _logger.LogError(ex, "Error al obtener la fase de diseño para el proyecto {ProjectId}", projectId);
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
                    // Fase 2
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
                _logger.LogError(ex, "Error al crear la fase de diseño para el proyecto {ProjectId}", request.ProjectId);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        #endregion

        #region Helper

        /// <summary>
        /// Elimina el archivo si existe, usando el WebRootPath.
        /// </summary>
        /// <param name="filePath">La ruta relativa del archivo (por ejemplo, /uploads/imagen.jpg)</param>
        private void DeleteFileIfExists(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                string uploadPath = Path.Combine(_environment.WebRootPath, "uploads");
                string fullPath = Path.Combine(uploadPath, Path.GetFileName(filePath));
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
        }

        #endregion

        #region Endpoints de Actualización

        // PUT: api/DesignPhases/{id} -> Actualización de la Fase 1 (Site Map)
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

                // Actualizar imagen solo si se envía una nueva ruta
                if (!string.IsNullOrEmpty(request.SiteMapFilePath) && request.SiteMapFilePath != designPhase.SiteMapFilePath)
                {
                    DeleteFileIfExists(designPhase.SiteMapFilePath);
                    designPhase.SiteMapFilePath = request.SiteMapFilePath;
                }

                designPhase.IsHierarchyClear = request.IsHierarchyClear ?? designPhase.IsHierarchyClear;
                designPhase.AreSectionsIdentified = request.AreSectionsIdentified ?? designPhase.AreSectionsIdentified;
                designPhase.AreLinksClear = request.AreLinksClear ?? designPhase.AreLinksClear;
                designPhase.AreVisualElementsUseful = request.AreVisualElementsUseful ?? designPhase.AreVisualElementsUseful;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);

                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(designPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase de diseño (Phase1) con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/DesignPhases/Phase2/{id} -> Actualización de la Fase 2 (Wireframes)
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

                // Actualizar Wireframe480pxPath
                if (!string.IsNullOrEmpty(request.Wireframe480pxPath) && request.Wireframe480pxPath != designPhase.Wireframe480pxPath)
                {
                    DeleteFileIfExists(designPhase.Wireframe480pxPath);
                    designPhase.Wireframe480pxPath = request.Wireframe480pxPath;
                }

                // Actualizar Wireframe768pxPath
                if (!string.IsNullOrEmpty(request.Wireframe768pxPath) && request.Wireframe768pxPath != designPhase.Wireframe768pxPath)
                {
                    DeleteFileIfExists(designPhase.Wireframe768pxPath);
                    designPhase.Wireframe768pxPath = request.Wireframe768pxPath;
                }

                // Actualizar Wireframe1024pxPath
                if (!string.IsNullOrEmpty(request.Wireframe1024pxPath) && request.Wireframe1024pxPath != designPhase.Wireframe1024pxPath)
                {
                    DeleteFileIfExists(designPhase.Wireframe1024pxPath);
                    designPhase.Wireframe1024pxPath = request.Wireframe1024pxPath;
                }

                designPhase.IsMobileFirst = request.IsMobileFirst ?? designPhase.IsMobileFirst;
                designPhase.IsNavigationClear = request.IsNavigationClear ?? designPhase.IsNavigationClear;
                designPhase.IsDesignFunctional = request.IsDesignFunctional ?? designPhase.IsDesignFunctional;
                designPhase.IsVisualConsistencyMet = request.IsVisualConsistencyMet ?? designPhase.IsVisualConsistencyMet;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);


                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(designPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase de diseño (Phase2) con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/DesignPhases/Phase3/{id} -> Actualización de la Fase 3 (Diseño Visual)
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
                if (request.AreVisualElementsBeneficialForSmallScreens.HasValue)
                    designPhase.AreVisualElementsBeneficialForSmallScreens = request.AreVisualElementsBeneficialForSmallScreens.Value;
                if (request.DoesDesignPrioritizeContentForMobile.HasValue)
                    designPhase.DoesDesignPrioritizeContentForMobile = request.DoesDesignPrioritizeContentForMobile.Value;
                if (request.DoesDesignImproveLoadingSpeed.HasValue)
                    designPhase.DoesDesignImproveLoadingSpeed = request.DoesDesignImproveLoadingSpeed.Value;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);


                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(designPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase de diseño visual (Phase3) con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        // PUT: api/DesignPhases/Phase4/{id} -> Actualización de la Fase 4 (Creación de Contenidos)
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

                designPhase.ContentFilePath = request.ContentFilePath;
                if (request.AreContentsRelevantForMobile.HasValue)
                    designPhase.AreContentsRelevantForMobile = request.AreContentsRelevantForMobile.Value;
                if (request.AreContentsClearAndNavigable.HasValue)
                    designPhase.AreContentsClearAndNavigable = request.AreContentsClearAndNavigable.Value;
                if (request.DoContentsGuideUserAttention.HasValue)
                    designPhase.DoContentsGuideUserAttention = request.DoContentsGuideUserAttention.Value;
                designPhase.UpdatedAt = DateTime.UtcNow;

                _context.DesignPhases.Update(designPhase);


                // Marca el proyecto como actualizado:
                await PropagateProjectTimestamp(designPhase.ProjectId);

                await _context.SaveChangesAsync();

                return Ok(designPhase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la fase de creación de contenidos (Phase4) con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        #endregion

        #region Endpoint de Eliminación

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
                _logger.LogError(ex, "Error al eliminar la fase de diseño con id {Id}", id);
                return StatusCode(500, new { Message = "Error interno del servidor.", Error = ex.Message });
            }
        }

        #endregion
    }

    #region Modelos

    public class CreateDesignPhaseRequest
    {
        public int ProjectId { get; set; }
        public string SiteMapFilePath { get; set; }
        public bool? IsHierarchyClear { get; set; }
        public bool? AreSectionsIdentified { get; set; }
        public bool? AreLinksClear { get; set; }
        public bool? AreVisualElementsUseful { get; set; }
        // Fase 2
        public string Wireframe480pxPath { get; set; }
        public string Wireframe768pxPath { get; set; }
        public string Wireframe1024pxPath { get; set; }
        public bool? IsMobileFirst { get; set; }
        public bool? IsNavigationClear { get; set; }
        public bool? IsDesignFunctional { get; set; }
        public bool? IsVisualConsistencyMet { get; set; }
    }

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
        public bool? AreVisualElementsBeneficialForSmallScreens { get; set; }
        public bool? DoesDesignPrioritizeContentForMobile { get; set; }
        public bool? DoesDesignImproveLoadingSpeed { get; set; }
    }

    public class UpdateContentCreationRequest
    {
        public string ContentFilePath { get; set; }
        public bool? AreContentsRelevantForMobile { get; set; }
        public bool? AreContentsClearAndNavigable { get; set; }
        public bool? DoContentsGuideUserAttention { get; set; }
    }

    #endregion
}
