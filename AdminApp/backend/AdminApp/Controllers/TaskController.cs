using AdminApp.Models;
using AdminApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Shpargalkin.AdminApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;
    public TasksController(ITaskService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var tasks = await _service.GetTasks(q, page, limit);
        return Ok(new { data = tasks });
    }

    [HttpPost]
    public async Task<IActionResult> AddTask(TaskItem task)
    {
        var added = await _service.AddTask(task);
        return Ok(added);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem task)
    {
        task.Id = id;
        await _service.UpdateTask(task);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        await _service.DeleteTask(id);
        return Ok();
    }
}
