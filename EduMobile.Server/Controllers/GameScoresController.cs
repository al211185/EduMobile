// Controllers/GameScoresController.cs
using EduMobile.Server.Areas.Identity.Data;
using EduMobile.Server.Data;
using EduMobile.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
[Authorize]
public class GameScoresController : ControllerBase
{
    private readonly ApplicationDbContext _ctx;
    public GameScoresController(ApplicationDbContext ctx) => _ctx = ctx;

    // GET: api/GameScores
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var score = await _ctx.GameScores.SingleOrDefaultAsync(gs => gs.UserId == userId);
        if (score == null) return Ok(new { CorrectCount = 0, AttemptCount = 0 });
        return Ok(score);
    }

    // PUT: api/GameScores
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] GameScoreUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var score = await _ctx.GameScores.SingleOrDefaultAsync(gs => gs.UserId == userId)
                    ?? new GameScore { UserId = userId, CorrectCount = 0, AttemptCount = 0 };
        score.CorrectCount += dto.AddCorrect;
        score.AttemptCount += dto.AddAttempts;
        score.LastPlayedAt = DateTime.UtcNow;
        if (score.Id == 0) _ctx.GameScores.Add(score); else _ctx.GameScores.Update(score);
        await _ctx.SaveChangesAsync();
        return Ok(score);
    }
}

// DTO
public class GameScoreUpdateDto
{
    public int AddCorrect { get; set; }
    public int AddAttempts { get; set; }
}
