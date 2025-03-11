using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduMobile.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevelopmentPhasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DevelopmentPhasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DevelopmentPhases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DevelopmentPhase>>> GetDevelopmentPhases()
        {
            return await _context.DevelopmentPhases
                .Include(dp => dp.KanbanItems)
                .ToListAsync();
        }

        // GET: api/DevelopmentPhases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DevelopmentPhase>> GetDevelopmentPhase(int id)
        {
            var developmentPhase = await _context.DevelopmentPhases
                .Include(dp => dp.KanbanItems)
                .FirstOrDefaultAsync(dp => dp.Id == id);

            if (developmentPhase == null)
            {
                return NotFound();
            }

            return developmentPhase;
        }

        // GET: api/DevelopmentPhases/byproject/5
        [HttpGet("byproject/{projectId}")]
        public async Task<ActionResult<DevelopmentPhase>> GetDevelopmentPhaseByProject(int projectId)
        {
            var developmentPhase = await _context.DevelopmentPhases
                .Include(dp => dp.KanbanItems)
                .FirstOrDefaultAsync(dp => dp.ProjectId == projectId);

            if (developmentPhase == null)
            {
                return NotFound();
            }

            return developmentPhase;
        }

        // POST: api/DevelopmentPhases
        [HttpPost]
        public async Task<ActionResult<DevelopmentPhase>> PostDevelopmentPhase(DevelopmentPhase developmentPhase)
        {
            _context.DevelopmentPhases.Add(developmentPhase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDevelopmentPhase), new { id = developmentPhase.Id }, developmentPhase);
        }

        // PUT: api/DevelopmentPhases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDevelopmentPhase(int id, DevelopmentPhase developmentPhase)
        {
            if (id != developmentPhase.Id)
            {
                return BadRequest();
            }

            developmentPhase.UpdatedAt = DateTime.UtcNow;
            _context.Entry(developmentPhase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DevelopmentPhaseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/DevelopmentPhases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevelopmentPhase(int id)
        {
            var developmentPhase = await _context.DevelopmentPhases.FindAsync(id);
            if (developmentPhase == null)
            {
                return NotFound();
            }

            _context.DevelopmentPhases.Remove(developmentPhase);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ----------------------------
        // Endpoints para KanbanItems
        // ----------------------------

        // GET: api/DevelopmentPhases/{developmentPhaseId}/kanbanitems
        [HttpGet("{developmentPhaseId}/kanbanitems")]
        public async Task<ActionResult<IEnumerable<KanbanItem>>> GetKanbanItems(int developmentPhaseId)
        {
            var items = await _context.KanbanItems
                .Where(ki => ki.DevelopmentPhaseId == developmentPhaseId)
                .ToListAsync();
            return items;
        }

        // POST: api/DevelopmentPhases/{developmentPhaseId}/kanbanitems
        [HttpPost("{developmentPhaseId}/kanbanitems")]
        public async Task<ActionResult<KanbanItem>> PostKanbanItem(int developmentPhaseId, KanbanItem kanbanItem)
        {
            // Aseguramos que la tarjeta pertenezca al DevelopmentPhase indicado
            kanbanItem.DevelopmentPhaseId = developmentPhaseId;
            _context.KanbanItems.Add(kanbanItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetKanbanItems),
                new { developmentPhaseId = developmentPhaseId, id = kanbanItem.Id },
                kanbanItem);
        }

        public class UpdateKanbanItemDto
        {
            public string Status { get; set; }
            public int Order { get; set; }
        }

        [HttpPut("{developmentPhaseId}/kanbanitems/{id}")]
        public async Task<IActionResult> PutKanbanItem(int developmentPhaseId, int id, [FromBody] UpdateKanbanItemDto updatedItem)
        {
            // Chequeamos si el modelo recibido es válido
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingItem = await _context.KanbanItems
                .FirstOrDefaultAsync(ki => ki.Id == id && ki.DevelopmentPhaseId == developmentPhaseId);

            if (existingItem == null)
            {
                return NotFound();
            }

            existingItem.Status = updatedItem.Status;
            existingItem.Order = updatedItem.Order;
            existingItem.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.KanbanItems.Any(ki => ki.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        // DELETE: api/DevelopmentPhases/{developmentPhaseId}/kanbanitems/{id}
        [HttpDelete("{developmentPhaseId}/kanbanitems/{id}")]
        public async Task<IActionResult> DeleteKanbanItem(int developmentPhaseId, int id)
        {
            var kanbanItem = await _context.KanbanItems.FindAsync(id);
            if (kanbanItem == null || kanbanItem.DevelopmentPhaseId != developmentPhaseId)
            {
                return NotFound();
            }

            _context.KanbanItems.Remove(kanbanItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DevelopmentPhaseExists(int id)
        {
            return _context.DevelopmentPhases.Any(e => e.Id == id);
        }
    }
}
