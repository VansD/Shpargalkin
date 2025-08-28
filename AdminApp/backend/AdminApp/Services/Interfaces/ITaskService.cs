using AdminApp.Models;

namespace AdminApp.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItem>> GetTasks(string? search, int page, int limit);
        Task<TaskItem> AddTask(TaskItem task);
        Task UpdateTask(TaskItem task);
        Task DeleteTask(int id);
    }
}
